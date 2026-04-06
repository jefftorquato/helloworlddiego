import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCalculation, fetchCalculations } from './api';
import { useCalculatorStore } from './store';

const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];

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
    <main className="container">
      <h1>Calculator Platform</h1>

      <section className="calculator">
        <input
          className="display"
          value={expression}
          onChange={(event) => restore(event.target.value, result)}
          placeholder="Enter expression"
        />
        <div className="result">Result: {result || '-'}</div>

        <div className="grid">
          {buttons.map((button) => (
            <button key={button} onClick={() => append(button)}>
              {button}
            </button>
          ))}
          <button onClick={clear}>C</button>
          <button onClick={onEquals}>=</button>
        </div>
      </section>

      <section className="history">
        <h2>History</h2>
        {historyQuery.isLoading ? <p>Loading...</p> : null}
        {historyQuery.isError ? <p>Failed to load history.</p> : null}
        <ul>
          {historyQuery.data?.map((item) => (
            <li key={item.id}>
              <button
                className="history-item"
                onClick={() => restore(item.expression, item.result)}
              >
                {item.expression} = {item.result}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
