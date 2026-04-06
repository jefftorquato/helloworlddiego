export type Healthcheck = {
  status: 'ok';
};

export type CreateCalculationInput = {
  expression: string;
  result: string;
};

export type Calculation = {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
};
