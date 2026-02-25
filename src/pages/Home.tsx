import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Upload, FileText, Trash2 } from 'lucide-react';
import { chapters } from '../data/chapters';
import { useStore } from '../store/useStore';
import ChapterCard from '../components/ChapterCard';
import XPBadge from '../components/XPBadge';
import StreakCounter from '../components/StreakCounter';
import Hearts from '../components/Hearts';

type LevelFilter = 'tous' | '6e' | '5e';

export default function Home() {
  const [filter, setFilter] = useState<LevelFilter>('tous');
  const navigate = useNavigate();
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const getHearts = useStore((s) => s.getHearts);
  const importedSessions = useStore((s) => s.importedSessions);
  const removeImportedSession = useStore((s) => s.removeImportedSession);

  const filtered = filter === 'tous' ? chapters : chapters.filter((c) => c.level === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Revi<span className="text-blue-500">Math</span>
          </h1>
          <div className="flex items-center gap-3">
            <StreakCounter streak={streak} />
            <XPBadge xp={xp} />
            <Hearts count={getHearts()} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Import PDF Button */}
        <button
          onClick={() => navigate('/import')}
          className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all shadow-md"
        >
          <Upload size={20} /> Importer un PDF
        </button>

        {/* Imported Sessions */}
        {importedSessions.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-gray-700 mb-3">Sessions importees</h2>
            <div className="space-y-2">
              {importedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-all"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/lesson/${session.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-purple-500" />
                      <span className="font-bold text-gray-800">{session.title}</span>
                      {session.level && (
                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {session.level.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {session.exercises.length} exercices &middot; {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImportedSession(session.id); }}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Filter */}
        <div className="flex gap-2 mb-6">
          {(['tous', '6e', '5e'] as LevelFilter[]).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                filter === level
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {level === 'tous' ? 'Tous' : level.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        {/* Admin Link */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            <Settings size={16} />
            Mode Admin
          </button>
        </div>
      </main>
    </div>
  );
}
