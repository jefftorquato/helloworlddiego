import { Calculation, CreateCalculationInput } from '@calc/shared';

const API_BASE = 'http://localhost:3000';
const HISTORY_KEY = 'calc_history';

function readLocalHistory(): Calculation[] {
  const raw = localStorage.getItem(HISTORY_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Calculation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(items: Calculation[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 20)));
}

export async function createCalculation(payload: CreateCalculationInput) {
  try {
    const response = await fetch(`${API_BASE}/calculations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save calculation');
    }

    return (await response.json()) as Calculation;
  } catch {
    const nextItem: Calculation = {
      id: crypto.randomUUID(),
      expression: payload.expression,
      result: payload.result,
      createdAt: new Date().toISOString(),
    };
    const history = readLocalHistory();
    const updated = [nextItem, ...history]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
    writeLocalHistory(updated);
    return nextItem;
  }
}

export async function fetchCalculations() {
  try {
    const response = await fetch(`${API_BASE}/calculations`);

    if (!response.ok) {
      throw new Error('Failed to fetch calculations');
    }

    return (await response.json()) as Calculation[];
  } catch {
    return readLocalHistory();
  }
}
