import { useUserInfo } from '@/hooks';
import { getRoleLabel } from '@/lib';
import { EventOptions } from '@/types';

export const useUsersByResponse = (responses: { [key: string]: { answer: EventOptions } } | undefined) => {
  const initialResponses: Record<EventOptions, { names: string; role: string; id: string }[]> = { yes: [], no: [] };

  if (!responses) {
    return initialResponses;
  }

  const mappedResponses = { ...initialResponses };

  for (const key in responses) {
    const { answer } = responses[key];
    const userData = useUserInfo(key);

    const roleLabel = getRoleLabel(userData.role);
    if (answer === 'yes') {
      mappedResponses.yes.push({ names: userData.names, role: roleLabel, id: key });
    } else {
      mappedResponses.no.push({ names: userData.names, role: roleLabel, id: key });
    }
  }

  for (const option of Object.keys(mappedResponses) as EventOptions[]) {
    mappedResponses[option].sort((a, b) => {
      if (a.role === b.role) {
        return a.names.localeCompare(b.names); // Sort by name if roles are equal
      }
      return a.role.localeCompare(b.role); // Sort by role
    });
  }

  return mappedResponses;
};
