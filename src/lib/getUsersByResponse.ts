import { EventOptions, Roles } from '@/types';

export const getUsersByResponse = (
  obj: { [key: string]: { answer: EventOptions; name: string; role: Roles } } | undefined
) => {
  const initialResponses: Record<EventOptions, { name: string; role: Roles }[]> = { yes: [], no: [], maybe: [] };

  if (!obj) {
    return initialResponses;
  }

  const responses = { ...initialResponses };

  for (const key in obj) {
    const { answer, name, role } = obj[key];
    if (answer === 'yes') {
      responses.yes.push({ name, role });
    } else if (answer === 'no') {
      responses.no.push({ name, role });
    } else if (answer === 'maybe') {
      responses.maybe.push({ name, role });
    }
  }

  // Sort each response array by name first and then by role
  for (const key in responses) {
    responses[key as EventOptions].sort((a, b) => {
      const nameComparison = a.name.localeCompare(b.name);
      return nameComparison !== 0 ? nameComparison : a.role.localeCompare(b.role);
    });
  }

  return responses;
};
