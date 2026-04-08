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
    <main className="app-shell">
      <div className="layout-grid">
        <section className="card calculator-card">
          <h1 className="panel-title">Calculator Platform</h1>

          <div className="display-panel">
            <input
              className="expression-input"
              value={expression}
              onChange={(event) => restore(event.target.value, result)}
              placeholder="Enter expression"
            />
            <div className="result-label">Result</div>
            <div className="result-value">{result || '-'}</div>
          </div>

          <div className="button-grid">
            {buttons.map((button) => {
              const isOperator = operators.has(button);
              return (
                <button
                  key={button}
                  onClick={() => append(button)}
                  className={`calc-button ${isOperator ? 'operator-button' : 'digit-button'}`}
                >
                  {button}
                </button>
              );
            })}
            <button onClick={clear} className="calc-button digit-button">
              C
            </button>
            <button onClick={onEquals} className="calc-button equals-button">
              =
            </button>
          </div>
        </section>

        <section className="card history-card">
          <h2 className="panel-title">History</h2>
          {historyQuery.isLoading ? <p className="history-loading">Loading...</p> : null}
          {historyQuery.isError ? <p className="history-error">Failed to load history.</p> : null}
          <ul className="history-list">
            {historyQuery.data?.map((item) => (
              <li key={item.id}>
                <button className="history-item" onClick={() => restore(item.expression, item.result)}>
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
