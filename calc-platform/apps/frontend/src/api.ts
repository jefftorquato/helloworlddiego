export type Calculation = {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
};

const API_BASE = 'http://localhost:3000';

export async function createCalculation(payload: {
  expression: string;
  result: string;
}) {
  const response = await fetch(`${API_BASE}/calculations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to save calculation');
  }

  return (await response.json()) as Calculation;
}

export async function fetchCalculations() {
  const response = await fetch(`${API_BASE}/calculations`);

  if (!response.ok) {
    throw new Error('Failed to fetch calculations');
  }

  return (await response.json()) as Calculation[];
}
