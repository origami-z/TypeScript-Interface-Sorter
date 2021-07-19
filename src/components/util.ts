

export const trimQuoation = (input: string): string => {
  return input.replace(/['"]+/g, '');
};

/** Whether input ends with '.css' */
export const isCss = (input: string): boolean => {
  return input.toLowerCase().endsWith('css');
};

/** Whether input does not start with '.' */
export const isGlobalModule = (input: string): boolean => {
  return !input.startsWith('.');
};