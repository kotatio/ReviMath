import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Loader2, Sparkles, Play, Key, AlertCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { extractTextFromPDF, type ExtractionProgress } from '../lib/pdf-extract';
import { generateExercises } from '../lib/generate-exercises';
import { saveApiKey, loadApiKey, clearApiKey, maskApiKey } from '../lib/api-key';
import type { Exercise, ImportedSession } from '../types';

type Step = 'upload' | 'extracting' | 'extracted' | 'generating' | 'generated';

export default function Import() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const addImportedSession = useStore((s) => s.addImportedSession);

  const savedKey = loadApiKey();
  const [step, setStep] = useState<Step>('upload');
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(savedKey.length > 0);
  const [showKey, setShowKey] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [level, setLevel] = useState<'6e' | '5e'>('6e');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [extractProgress, setExtractProgress] = useState<ExtractionProgress | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'md'>('pdf');

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const mdFiles = fileArray.filter((f) => f.name.endsWith('.md'));
    const pdfFiles = fileArray.filter((f) => f.name.endsWith('.pdf'));

    if (mdFiles.length === 0 && pdfFiles.length === 0) {
      setError('Seuls les fichiers PDF et Markdown (.md) sont acceptes');
      return;
    }
    if (mdFiles.length > 0 && pdfFiles.length > 0) {
      setError('Importe soit des PDF, soit des Markdown, pas les deux');
      return;
    }

    setError('');
    const names = fileArray.map((f) => f.name);
    setFileNames(names);
    setFileName(names.length === 1 ? names[0] : `${names.length} fichiers`);
    setStep('extracting');

    try {
      if (mdFiles.length > 0) {
        // Read all .md files and concatenate
        const texts: string[] = [];
        for (const f of mdFiles) {
          const content = await f.text();
          texts.push(`# ${f.name}\n\n${content}`);
        }
        const combined = texts.join('\n\n---\n\n');
        if (combined.trim().length < 20) {
          setError('Les fichiers Markdown ne contiennent pas assez de texte.');
          setStep('upload');
          return;
        }
        setExtractedText(combined);
        setStep('extracted');
      } else {
        // PDF: only first file
        const file = pdfFiles[0];
        const text = await extractTextFromPDF(file, (p) => setExtractProgress(p));
        setExtractProgress(null);
        if (text.trim().length < 20) {
          setError('Impossible d\'extraire du texte de ce PDF.');
          setStep('upload');
          return;
        }
        setExtractedText(text);
        setStep('extracted');
      }
    } catch {
      setExtractProgress(null);
      setError('Erreur lors de la lecture des fichiers.');
      setStep('upload');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    saveApiKey(apiKey.trim());
    setHasKey(true);
    setApiKey('');
    setShowKey(false);
  };

  const handleDeleteKey = () => {
    clearApiKey();
    setHasKey(false);
    setApiKey('');
  };

  const getActiveKey = (): string => {
    if (apiKey.trim()) return apiKey.trim();
    return loadApiKey();
  };

  const handleGenerate = async () => {
    const key = getActiveKey();
    if (!key) {
      setError('Saisis ta cle API Gemini');
      return;
    }
    // Save the key if it's new
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setHasKey(true);
      setApiKey('');
    }
    setError('');
    setStep('generating');

    try {
      const result = await generateExercises(extractedText, level, key);
      setExercises(result);
      const id = `import-${Date.now()}`;
      setSessionId(id);
      setStep('generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la generation');
      setStep('extracted');
    }
  };

  const handleLaunch = () => {
    const title = fileNames.length === 1
      ? fileNames[0].replace(/\.(pdf|md)$/i, '')
      : fileNames.map((n) => n.replace(/\.(pdf|md)$/i, '')).join(' + ');
    const session: ImportedSession = {
      id: sessionId,
      title,
      sourceFileName: fileNames.join(', '),
      exercises,
      createdAt: new Date().toISOString(),
      level,
    };
    addImportedSession(session);
    navigate(`/lesson/${sessionId}`);
  };

  const typeLabels: Record<string, string> = {
    qcm: 'QCM',
    fill_blank: 'Trou',
    true_false: 'Vrai/Faux',
    calcul: 'Calcul',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Importer un document</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* API Key */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Key size={18} className="text-gray-500" />
            <h2 className="font-bold text-gray-900">Cle API Gemini</h2>
          </div>

          {hasKey ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-sm text-gray-500">
                {maskApiKey(loadApiKey())}
              </div>
              <button
                onClick={handleDeleteKey}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Supprimer la cle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                  placeholder="AIzaSy..."
                  className="w-full p-3 pr-10 border rounded-lg font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="px-4 py-2 bg-blue-500 text-white font-bold text-sm rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-all"
              >
                Enregistrer
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Stockee uniquement pour cette session navigateur. Fermez l'onglet pour l'effacer.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Format Selector + Upload Zone */}
        {(step === 'upload' || step === 'extracting') && (
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3">Type de document</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFileType('pdf')}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg font-bold text-sm transition-all border-2 ${
                    fileType === 'pdf'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <FileText size={24} />
                  <span>PDF</span>
                  <span className="text-xs font-normal">Cours, controles scannes</span>
                </button>
                <button
                  onClick={() => setFileType('md')}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg font-bold text-sm transition-all border-2 ${
                    fileType === 'md'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <FileText size={24} />
                  <span>Markdown</span>
                  <span className="text-xs font-normal">Fiches texte, notes .md</span>
                </button>
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`bg-white rounded-xl p-10 shadow-sm border-2 border-dashed cursor-pointer transition-all text-center ${
                step === 'extracting' ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              {step === 'extracting' ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={40} className="text-blue-500 animate-spin" />
                  <p className="text-gray-600 font-medium">
                    {extractProgress?.stage === 'ocr'
                      ? `OCR page ${extractProgress.page}/${extractProgress.totalPages} (scan detecte)...`
                      : `Lecture de ${fileName}...`}
                  </p>
                  {extractProgress?.stage === 'ocr' && (
                    <p className="text-xs text-gray-400">L'OCR peut prendre quelques secondes par page</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload size={40} className="text-gray-400" />
                  {fileType === 'pdf' ? (
                    <>
                      <p className="text-gray-600 font-medium">Glisse un PDF ici ou clique pour choisir</p>
                      <p className="text-xs text-gray-400">Cours, fiches d'exercices, controles...</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 font-medium">Glisse un ou plusieurs fichiers .md</p>
                      <p className="text-xs text-gray-400">Tu peux en selectionner plusieurs a la fois</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={fileType === 'pdf' ? '.pdf' : '.md'}
                multiple={fileType === 'md'}
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) handleFiles(files);
                }}
              />
            </div>
          </>
        )}

        {/* Extracted Text Preview */}
        {(step === 'extracted' || step === 'generating') && (
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-green-500" />
                <h2 className="font-bold text-gray-900">{fileName}</h2>
                <span className="text-xs text-gray-400 ml-auto">
                  {extractedText.length} caracteres extraits
                </span>
              </div>
              <textarea
                readOnly
                value={extractedText.slice(0, 2000) + (extractedText.length > 2000 ? '\n...' : '')}
                rows={8}
                className="w-full p-3 border rounded-lg text-sm text-gray-600 bg-gray-50 resize-none"
              />
            </div>

            {/* Level + Generate */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Niveau</h2>
                <div className="flex gap-2">
                  {(['6e', '5e'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        level === l ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={step === 'generating' || (!hasKey && !apiKey.trim())}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {step === 'generating' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Generation en cours...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Generer 10 exercices avec Gemini
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Generated Exercises Preview */}
        {step === 'generated' && (
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3">
                {exercises.length} exercices generes
              </h2>
              <div className="space-y-2">
                {exercises.map((ex, i) => (
                  <div key={ex.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-bold text-white bg-gray-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {typeLabels[ex.type] ?? ex.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{ex.question}</p>
                      {ex.choices && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ex.choices.map((c) => (
                            <span
                              key={c}
                              className={`text-xs px-2 py-0.5 rounded ${
                                c === ex.correctAnswer
                                  ? 'bg-green-100 text-green-700 font-bold'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {!ex.choices && (
                        <p className="text-xs text-green-600 mt-1">
                          Reponse : {ex.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('extracted'); setExercises([]); }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Regenerer
              </button>
              <button
                onClick={handleLaunch}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
              >
                <Play size={20} /> Lancer la session
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
