import { useRef, type ChangeEvent } from 'react';
import { FileText, RotateCcw, Upload } from 'lucide-react';
import { DEFAULT_LIBRARY_TEXT } from '../data/libraryData';
import type { KnowledgeBaseResult } from '../types/qa';

interface KnowledgeBaseSectionProps {
  libraryText: string;
  onLibraryTextChange: (value: string) => void;
  kbResult: KnowledgeBaseResult;
}

export function KnowledgeBaseSection({
  libraryText,
  onLibraryTextChange,
  kbResult,
}: KnowledgeBaseSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const indexedCount = kbResult.parsedLines.filter(
    (line) => line.status === 'indexed',
  ).length;
  const skippedCount = kbResult.parsedLines.length - indexedCount;

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target?.result;
      if (typeof content === 'string') {
        onLibraryTextChange(content);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <section
      id="knowledge-base"
      className="border-b border-slate-200 bg-white py-10 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Document Processing &amp; Knowledge Base
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
              The loader reads <code className="font-mono text-slate-800">library.txt</code>{' '}
              line by line, splits each line at the first colon so timestamps like{' '}
              <code className="font-mono text-slate-800">9:00 AM</code> stay intact,
              lower-cases the topic key, and skips lines without a colon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload plain text library document"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[40px] sm:min-h-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-rose-900 hover:text-rose-900 cursor-pointer whitespace-nowrap"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Upload .txt File
            </button>
            <button
              type="button"
              onClick={() => onLibraryTextChange(DEFAULT_LIBRARY_TEXT)}
              className="min-h-[40px] sm:min-h-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset library.txt
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-rose-900" aria-hidden="true" />
                <label
                  htmlFor="library-txt-editor"
                  className="font-mono text-xs font-semibold text-slate-900"
                >
                  library.txt (Editable Source)
                </label>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {indexedCount} indexed · {skippedCount} skipped
              </span>
            </div>

            <textarea
              id="library-txt-editor"
              value={libraryText}
              onChange={(event) => onLibraryTextChange(event.target.value)}
              rows={9}
              spellCheck={false}
              className="w-full flex-1 rounded-lg border border-slate-300 bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-800 focus:border-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-900"
            />

            <p className="mt-3 text-xs text-slate-500">
              Edit any line or upload a{' '}
              <code className="font-mono text-slate-700">.txt</code> file above to
              rebuild the Knowledge Base live using the{' '}
              <code className="font-mono text-slate-700">Topic: answer</code> format.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Constructed Dictionary Knowledge Base
              </h3>
              <span className="font-mono text-xs text-slate-500">
                dict[topic.lower()] = answer
              </span>
            </div>

            <div className="divide-y divide-slate-100 sm:hidden">
              {kbResult.parsedLines.map((line) => (
                <div key={line.lineNumber} className="py-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono font-semibold ${
                        line.status === 'indexed'
                          ? 'text-rose-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {line.status === 'indexed' ? line.topic : 'skipped'}
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      Line {String(line.lineNumber).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-slate-700">
                    {line.status === 'indexed'
                      ? line.answer
                      : `${line.raw || '(empty)'} — ${line.reason}`}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-2.5 pr-4 font-mono">Line</th>
                    <th className="py-2.5 pr-4">Dictionary Key</th>
                    <th className="py-2.5">Stored Value / Parser Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kbResult.parsedLines.map((line) => (
                    <tr key={line.lineNumber} className="align-top">
                      <td className="py-3 pr-4 font-mono text-xs tabular-nums text-slate-400">
                        {String(line.lineNumber).padStart(2, '0')}
                      </td>
                      {line.status === 'indexed' ? (
                        <>
                          <td className="py-3 pr-4 font-mono text-xs font-semibold text-rose-900 whitespace-nowrap">
                            {line.topic}
                          </td>
                          <td className="py-3 text-xs leading-relaxed text-slate-700">
                            {line.answer}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 pr-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                            skipped
                          </td>
                          <td className="py-3 text-xs text-slate-500">
                            <span className="font-mono text-slate-600">
                              {line.raw || '(empty)'}
                            </span>
                            <span className="mx-1.5 text-slate-300" aria-hidden="true">
                              —
                            </span>
                            <span>{line.reason}</span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
