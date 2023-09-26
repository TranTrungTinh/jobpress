/* eslint-disable prettier/prettier */
// TODO: transform ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
export const getSelectFields = (fields: string[] = []) => {
  return Object.fromEntries(fields.map((field) => [field, 1]));
};

// TODO: transform ['a', 'b', 'c'] => { a: 0, b: 0, c: 0 }
export const getUnSelectFields = (fields: string[] = []) => {
  return Object.fromEntries(fields.map((field) => [field, 0]));
};
