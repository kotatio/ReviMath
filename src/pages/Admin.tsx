import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { chapters } from '../data/chapters';
import type { Exercise, ExerciseType } from '../types';

export default function Admin() {
  const navigate = useNavigate();
  const customExercises = useStore((s) => s.customExercises);
  const addCustomExercise = useStore((s) => s.addCustomExercise);
  const removeCustomExercise = useStore((s) => s.removeCustomExercise);
  const resetProgress = useStore((s) => s.resetProgress);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<ExerciseType>('qcm');
  const [lessonId, setLessonId] = useState(chapters[0]?.lessons[0]?.id ?? '');
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [preview, setPreview] = useState(false);

  const allLessons = chapters.flatMap((ch) =>
    ch.lessons.map((l) => ({ id: l.id, label: `${ch.title} > ${l.title}` }))
  );

  const handleSubmit = () => {
    if (!question.trim() || !correctAnswer.trim()) return;
    const exercise: Exercise = {
      id: `${lessonId}-custom-${Date.now()}`,
      type,
      question: question.trim(),
      correctAnswer: correctAnswer.trim(),
      explanation: explanation.trim() || undefined,
      choices: type === 'qcm' ? choices.filter((c) => c.trim()) : undefined,
    };
    addCustomExercise(exercise);
    setQuestion('');
    setChoices(['', '', '', '']);
    setCorrectAnswer('');
    setExplanation('');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mode Admin</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-2">Statistiques</h2>
          <p className="text-sm text-gray-600">
            {chapters.length} chapitres &middot;{' '}
            {chapters.reduce((a, c) => a + c.lessons.length, 0)} lecons &middot;{' '}
            {chapters.reduce((a, c) => a + c.lessons.reduce((b, l) => b + l.exercises.length, 0), 0)} exercices de base &middot;{' '}
            {customExercises.length} exercice{customExercises.length > 1 ? 's' : ''} custom
          </p>
        </div>

        {/* Custom Exercises List */}
        {customExercises.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Exercices custom</h2>
            <div className="space-y-2">
              {customExercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-xs font-mono text-gray-400">{ex.type}</span>
                    <p className="text-sm text-gray-800">{ex.question}</p>
                  </div>
                  <button
                    onClick={() => removeCustomExercise(ex.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
          >
            <Plus size={20} /> Ajouter un exercice
          </button>
        ) : (
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900">Nouvel exercice</h2>

            {/* Lesson selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lecon</label>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white"
              >
                {allLessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="flex gap-2 flex-wrap">
                {(['qcm', 'fill_blank', 'true_false', 'calcul'] as ExerciseType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      type === t ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t === 'qcm' ? 'QCM' : t === 'fill_blank' ? 'Trou' : t === 'true_false' ? 'Vrai/Faux' : 'Calcul'}
                  </button>
                ))}
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg"
                placeholder="Combien font 2 + 2 ?"
              />
            </div>

            {/* Choices (QCM) */}
            {type === 'qcm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choix (2-4)</label>
                {choices.map((c, i) => (
                  <input
                    key={i}
                    value={c}
                    onChange={(e) => {
                      const next = [...choices];
                      next[i] = e.target.value;
                      setChoices(next);
                    }}
                    className="w-full p-2 border rounded-lg mb-1"
                    placeholder={`Choix ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonne reponse
                {type === 'true_false' && ' (true ou false)'}
              </label>
              <input
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder={type === 'true_false' ? 'true' : 'La reponse correcte'}
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Explication (optionnel)</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg"
                placeholder="Parce que..."
              />
            </div>

            {/* Preview */}
            {preview && question && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700 mb-1">Apercu :</p>
                <p className="font-semibold">{question}</p>
                {type === 'qcm' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {choices.filter(Boolean).map((c) => (
                      <span
                        key={c}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          c === correctAnswer ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {type === 'true_false' && <p className="text-sm mt-1">Reponse : {correctAnswer}</p>}
                {(type === 'calcul' || type === 'fill_blank') && (
                  <p className="text-sm mt-1">Reponse attendue : {correctAnswer}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Eye size={16} /> {preview ? 'Masquer' : 'Apercu'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!question.trim() || !correctAnswer.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <h2 className="font-bold text-red-600 mb-2">Zone danger</h2>
          <button
            onClick={() => {
              if (window.confirm('Remettre toute la progression a zero ?')) {
                resetProgress();
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all"
          >
            Reinitialiser la progression
          </button>
        </div>
      </main>
    </div>
  );
}
