export const getFirstChars = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word[0])
    .join('');
};
