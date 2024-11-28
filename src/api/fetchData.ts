import request, { gql } from 'graphql-request';

export const fetchData = async <T>(options: string) => {
  if (!import.meta.env.VITE_HYGRAPH_API) {
    return;
  }

  const document = gql`
    ${options}
  `;

  const response = await request(import.meta.env.VITE_HYGRAPH_API, document);

  return response as T;
};
