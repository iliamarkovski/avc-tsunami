export const getNameById = (data: { name: string; id?: string }[] = [], id: string) => {
  return data.find((item) => item.id === id)?.name || '???';
};
