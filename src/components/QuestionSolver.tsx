import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, Search, X } from 'lucide-react';
import {
  DEFAULT_WORKED_EXAMPLE,
  SAMPLE_QUESTIONS,
  SCORE_THRESHOLD,
  SYSTEM_METADATA,
} from '../data/libraryData';
import type { QAResult } from '../types/qa';

interface QuestionSolverProps {
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmitQuestion: (value: string) => void;
  finalResult: QAResult;
}

export function QuestionSolver({
  question,
  onQuestionChange,
  onSubmitQuestion,
  finalResult,
}: QuestionSolverProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim()) {
      onSubmitQuestion(question);
    }
  };

  const maxScoreScale = Math.max(
    4,
    ...finalResult.topicScores.map((item) => item.score),
  );

  return (
    <section id="solver" className="border-b border-slate-200 bg-slate-50 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 sm:mb-7">
          <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
            {SYSTEM_METADATA.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {SYSTEM_METADATA.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <label
                  htmlFor="library-question-input"
                  className="block text-sm font-semibold text-slate-900"
                >
                  Ask a Library Question
                </label>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="library-question-input"
                      type="text"
                      value={question}
                      onChange={(event) => onQuestionChange(event.target.value)}
                      placeholder="e.g., How much penalty is charged for late returns?"
                      className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-900 focus:outline-none focus:ring-1 focus:ring-rose-900"
                    />
                    {question && (
                      <button
                        type="button"
                        onClick={() => onQuestionChange('')}
                        aria-label="Clear question"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-rose-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-900 whitespace-nowrap cursor-pointer"
                    >
                      Ask Question
                    </button>
                    <button
                      type="button"
                      onClick={() => onSubmitQuestion(DEFAULT_WORKED_EXAMPLE.question)}
                      title="Reset to Worked Example"
                      aria-label="Reset to worked example"
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-2">
                  Try sample questions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((sample) => {
                    const isActive = question === sample;
                    return (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => onSubmitQuestion(sample)}
                        className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'border-rose-900 bg-rose-50 text-rose-950 font-medium'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {sample}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {finalResult.isFallback ? (
                    <AlertCircle
                      className="h-5 w-5 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                  ) : (
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      finalResult.isFallback ? 'text-amber-800' : 'text-emerald-800'
                    }`}
                  >
                    {finalResult.isFallback
                      ? 'Fallback Triggered (Score Below Threshold)'
                      : 'Answer Retrieved from Knowledge Base'}
                  </span>
                </div>

                <div className="text-xs font-mono tabular-nums text-slate-500">
                  Best score: {finalResult.winningScore} / threshold {SCORE_THRESHOLD}
                  <span className="mx-2 text-slate-300" aria-hidden="true">
                    |
                  </span>
                  {finalResult.responseTimeMs.toFixed(3)} ms
                </div>
              </div>

              <div className="py-5">
                <div className="text-xs text-slate-500">
                  Selected KB Topic:{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    {finalResult.winningTopic ?? 'none (out of scope)'}
                  </span>
                </div>
                <p className="mt-2 text-base sm:text-lg font-medium leading-relaxed text-slate-900">
                  {finalResult.answer}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-700">
                    Tokenization &amp; Normalization Trace
                  </span>
                  <span className="text-xs text-slate-500">
                    Deterministic string operations
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500 mb-1">1. Alphanumeric tokens</div>
                    <div className="font-mono text-slate-800 break-words">
                      {finalResult.tokenization.allTokens.length > 0
                        ? finalResult.tokenization.allTokens.join(', ')
                        : '—'}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500 mb-1">2. Stop words removed</div>
                    <div className="font-mono text-slate-800 break-words">
                      {finalResult.tokenization.filteredTokens.length > 0
                        ? finalResult.tokenization.filteredTokens.join(', ')
                        : '—'}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-slate-500 mb-1">3. Suffix stripped</div>
                    <div className="font-mono font-medium text-rose-900 break-words">
                      {finalResult.tokenization.strippedTokens.length > 0
                        ? finalResult.tokenization.strippedTokens.join(', ')
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="flex items-baseline justify-between gap-2 pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Topic Score Breakdown
              </h2>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                Threshold ≥ {SCORE_THRESHOLD}
              </span>
            </div>

            <div className="mt-2 divide-y divide-slate-100">
              {finalResult.topicScores.map((topicScore, index) => {
                const isWinner =
                  finalResult.winningTopic === topicScore.topic &&
                  finalResult.passedThreshold;
                const widthPercent = Math.min(
                  100,
                  Math.round((topicScore.score / maxScoreScale) * 100),
                );

                return (
                  <div
                    key={topicScore.topic}
                    className={`py-3.5 transition-colors ${
                      isWinner ? 'bg-emerald-50/40 -mx-2 px-2 rounded-lg' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs tabular-nums text-slate-400">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {topicScore.displayName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isWinner && (
                          <span className="text-xs font-semibold text-emerald-800">
                            Selected
                          </span>
                        )}
                        <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                          {topicScore.score}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full transition-all duration-200 ${
                          isWinner
                            ? 'bg-emerald-700'
                            : topicScore.score >= SCORE_THRESHOLD
                              ? 'bg-slate-600'
                              : 'bg-slate-400'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {topicScore.matchedKeywords.length > 0 ? (
                        <span className="font-mono">
                          {topicScore.matchedKeywords
                            .map((kw) => `${kw.keyword} (+${kw.weight})`)
                            .join(' + ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">No matched keywords</span>
                      )}
                      {!topicScore.inKnowledgeBase && topicScore.score > 0 && (
                        <span className="ml-2 text-rose-700 font-medium">
                          (Missing from Knowledge Base)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              Every topic rule is evaluated independently. Distinctive terms such as{' '}
              <code className="font-mono text-slate-700">fine (4)</code> or{' '}
              <code className="font-mono text-slate-700">penalty (4)</code> outweigh
              shared words like{' '}
              <code className="font-mono text-slate-700">return (2)</code> or{' '}
              <code className="font-mono text-slate-700">book (1)</code>. Ties are
              broken by rule order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
