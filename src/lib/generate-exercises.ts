import type { Exercise } from '../types';

const SYSTEM_PROMPT = `Tu es un professeur de mathematiques experimente. Tu crees des exercices pour des eleves de college (6e-5e, 11-12 ans). Tes exercices sont clairs, precis, et adaptes au niveau demande. Tu reponds UNIQUEMENT avec du JSON valide, sans commentaire ni texte autour.`;

function buildPrompt(text: string, level: string): string {
  return `${SYSTEM_PROMPT}

A partir du contenu suivant extrait d'un document PDF de maths, genere exactement 10 exercices varies pour un eleve de ${level}.

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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(text, level) }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string; status?: string } };
    if (response.status === 400 && err.error?.message?.includes('API key'))
      throw new Error('Cle API Gemini invalide');
    if (response.status === 429)
      throw new Error('Trop de requetes, reessaie dans quelques secondes');
    throw new Error(err.error?.message ?? `Erreur API (${response.status})`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Reponse vide de Gemini');

  // Extract JSON from response
  let jsonStr = rawText.trim();
  const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (jsonMatch) jsonStr = jsonMatch[0];

  let exercises: Exercise[];
  try {
    exercises = JSON.parse(jsonStr);
  } catch {
    throw new Error('Gemini a renvoye du JSON invalide. Reessaie.');
  }

  if (!Array.isArray(exercises)) throw new Error('Format inattendu');

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
