import { WEIGHTED_RULES } from '../data/libraryData';

export function RuleEngineSection() {
  return (
    <section id="rule-engine" className="bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Weighted Rule Base
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            Each topic carries an IF–THEN weighted keyword rule. Distinctive terms
            carry higher weights (3–4) than generic shared words like{' '}
            <code className="font-mono text-slate-800">book (1)</code> or{' '}
            <code className="font-mono text-slate-800">return (2)</code>.
          </p>
        </div>

        <div className="space-y-3 md:hidden">
          {WEIGHTED_RULES.map((rule) => (
            <div
              key={rule.topic}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {rule.displayName}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {rule.topic}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs leading-relaxed text-slate-700">
                {rule.keywords.map((kw) => `${kw.keyword} (${kw.weight})`).join(', ')}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th className="px-5 py-3 w-56">Topic (KB key)</th>
                  <th className="px-5 py-3">Keywords (weight)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WEIGHTED_RULES.map((rule) => (
                  <tr key={rule.topic} className="align-top">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {rule.displayName}
                      <div className="mt-0.5 font-mono text-xs font-normal text-slate-500">
                        {rule.topic}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs leading-relaxed text-slate-700">
                      {rule.keywords
                        .map((kw) => `${kw.keyword} (${kw.weight})`)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
