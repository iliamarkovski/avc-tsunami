import { EventOptions } from '@/types';

export const getUsersByResponse = (obj: { [key: string]: { answer: EventOptions; name: string } } | undefined) => {
  const initialResponses = { yes: [] as string[], no: [] as string[], maybe: [] as string[] };

  if (!obj) {
    return initialResponses;
  }

  const responses = { ...initialResponses };

  for (const key in obj) {
    const { answer, name } = obj[key];
    if (answer === 'yes') {
      responses.yes.push(name);
    } else if (answer === 'no') {
      responses.no.push(name);
    } else if (answer === 'maybe') {
      responses.maybe.push(name);
    }
  }

  return responses;
};
