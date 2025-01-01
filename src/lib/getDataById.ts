export const getDataById = (data: { id?: string }[] = [], id: string | undefined) => {
  if (!id) {
    return undefined;
  }
  return data.find((item) => item.id === id);
};
