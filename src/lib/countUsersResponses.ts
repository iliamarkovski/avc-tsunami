import { EventOptions } from '@/types';

export const countUsersResponses = (obj: { [key: string]: EventOptions } | undefined) => {
  const initValue = { yes: 0, no: 0, maybe: 0 };

  if (!obj) {
    initValue;
  }

  const counts = initValue;

  for (let key in obj) {
    if (obj[key] === 'yes') {
      counts.yes++;
    } else if (obj[key] === 'no') {
      counts.no++;
    } else if (obj[key] === 'maybe') {
      counts.maybe++;
    }
  }

  return counts;
};
