export const getDataById = <T extends { id?: string }>(data: T[] = [], id: string | undefined): T | undefined => {
  if (!id) {
    return undefined;
  }
  return data.find((item) => item.id === id);
};
