import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCalculation, fetchCalculations } from './api';
import { useCalculatorStore } from './store';

const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];
const operators = new Set(['/', '*', '-', '+']);

function evaluateExpression(expression: string) {
  if (!expression) {
    return '';
  }

  try {
    const value = Function(`"use strict"; return (${expression})`)();

    if (value === undefined || Number.isNaN(value)) {
      return 'Error';
    }

    return String(value);
  } catch {
    return 'Error';
  }
}

export function App() {
  const queryClient = useQueryClient();
  const { expression, result, append, clear, setResult, restore } = useCalculatorStore();

  const historyQuery = useQuery({
    queryKey: ['calculations'],
    queryFn: fetchCalculations,
  });

  const saveMutation = useMutation({
    mutationFn: createCalculation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
    },
  });

  const onEquals = () => {
    const computedResult = evaluateExpression(expression);
    setResult(computedResult);

    if (expression && computedResult !== 'Error') {
      saveMutation.mutate({ expression, result: computedResult });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[minmax(320px,430px)_minmax(280px,1fr)] md:items-start lg:gap-8">
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/85 p-5 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.45)] backdrop-blur sm:p-7">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-100">Calculator Platform</h1>

          <div className="mb-5 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4 shadow-inner shadow-slate-950/80">
            <input
              className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-right text-2xl font-medium tracking-wide text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              value={expression}
              onChange={(event) => restore(event.target.value, result)}
              placeholder="Enter expression"
            />
            <div className="text-right text-sm uppercase tracking-wide text-slate-400">Result</div>
            <div className="truncate text-right text-3xl font-semibold text-blue-400">{result || '-'}</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button) => {
              const isOperator = operators.has(button);
              return (
                <button
                  key={button}
                  onClick={() => append(button)}
                  className={`rounded-xl border px-3 py-4 text-lg font-semibold transition duration-150 active:scale-[0.98] ${
                    isOperator
                      ? 'border-blue-500/60 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25'
                      : 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700/95'
                  }`}
                >
                  {button}
                </button>
              );
            })}
            <button
              onClick={clear}
              className="rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-4 text-lg font-semibold text-slate-200 transition duration-150 hover:bg-slate-700/95 active:scale-[0.98]"
            >
              C
            </button>
            <button
              onClick={onEquals}
              className="col-span-3 rounded-xl border border-blue-400/60 bg-blue-600 px-3 py-4 text-lg font-bold text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.95)] transition duration-150 hover:bg-blue-500 active:scale-[0.98]"
            >
              =
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/85 p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.8)] backdrop-blur sm:p-7">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-100">History</h2>
          {historyQuery.isLoading ? <p className="text-sm text-slate-400">Loading...</p> : null}
          {historyQuery.isError ? <p className="text-sm text-red-300">Failed to load history.</p> : null}
          <ul className="space-y-3">
            {historyQuery.data?.map((item) => (
              <li key={item.id}>
                <button
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-left text-slate-100 transition hover:border-blue-400/70 hover:bg-slate-700/80"
                  onClick={() => restore(item.expression, item.result)}
                >
                  <div className="text-sm text-slate-300">{item.expression}</div>
                  <div className="mt-1 font-semibold text-blue-300">= {item.result}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
