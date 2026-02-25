import type { Exercise } from '../types';

const SYSTEM_PROMPT = `Tu es un professeur de mathematiques experimente. Tu crees des exercices pour des eleves de college (6e-5e, 11-12 ans). Tes exercices sont clairs, precis, et adaptes au niveau demande. Tu reponds UNIQUEMENT avec du JSON valide, sans commentaire ni texte autour.`;

function buildUserPrompt(text: string, level: string): string {
  return `A partir du contenu suivant extrait d'un document PDF de maths, genere exactement 10 exercices varies pour un eleve de ${level}.

Contenu du document :
---
${text.slice(0, 6000)}
---

Genere un JSON array d'exercices avec ce format EXACT :
[
  {
    "type": "qcm",
    "question": "...",
    "choices": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "..."
  },
  {
    "type": "calcul",
    "question": "...",
    "correctAnswer": "42",
    "explanation": "..."
  },
  {
    "type": "true_false",
    "question": "...",
    "correctAnswer": "true",
    "explanation": "..."
  },
  {
    "type": "fill_blank",
    "question": "... = ...",
    "correctAnswer": "7",
    "explanation": "..."
  }
]

Regles strictes :
- Exactement 10 exercices
- Melange les 4 types (au moins 2 QCM, 2 calcul, 2 true_false, 2 fill_blank)
- Pour QCM : exactement 4 choix, 1 seul correct, correctAnswer doit etre un des choix
- Pour true_false : correctAnswer est "true" ou "false"
- Pour calcul et fill_blank : correctAnswer est une valeur simple (nombre ou fraction)
- Chaque exercice a une explication pedagogique
- Les questions testent la comprehension du contenu du document
- Niveau adapte a un eleve de ${level}
- JSON valide uniquement, aucun texte avant ou apres`;
}

export async function generateExercises(
  text: string,
  level: string,
  apiKey: string
): Promise<Exercise[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(text, level) }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Cle API invalide');
    if (response.status === 429) throw new Error('Trop de requetes, reessaie dans quelques secondes');
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Erreur API (${response.status})`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text?: string }>;
  };
  const textBlock = data.content.find((b) => b.type === 'text');
  if (!textBlock?.text) throw new Error('Reponse vide de Claude');

  // Extract JSON from response (handle potential markdown wrapping)
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (jsonMatch) jsonStr = jsonMatch[0];

  let exercises: Exercise[];
  try {
    exercises = JSON.parse(jsonStr);
  } catch {
    throw new Error('Claude a renvoye du JSON invalide. Reessaie.');
  }

  if (!Array.isArray(exercises)) throw new Error('Format inattendu');

  // Add IDs and validate
  const timestamp = Date.now();
  return exercises.map((ex, i) => ({
    id: `gen-${timestamp}-${i}`,
    type: ex.type,
    question: ex.question,
    choices: ex.choices,
    correctAnswer: String(ex.correctAnswer),
    explanation: ex.explanation,
    hint: ex.hint,
  }));
}
