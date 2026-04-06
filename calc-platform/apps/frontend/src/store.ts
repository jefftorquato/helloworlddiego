import { create } from 'zustand';

type CalculatorStore = {
  expression: string;
  result: string;
  append: (value: string) => void;
  clear: () => void;
  setResult: (value: string) => void;
  restore: (expression: string, result: string) => void;
};

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  expression: '',
  result: '',
  append: (value) =>
    set((state) => ({
      expression: state.expression + value,
    })),
  clear: () => set({ expression: '', result: '' }),
  setResult: (value) => set({ result: value }),
  restore: (expression, result) => set({ expression, result }),
}));
