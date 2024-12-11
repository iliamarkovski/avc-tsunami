import { getRoleLabel } from '@/lib';
import { EventOptions, Roles } from '@/types';

export const getUsersByResponse = (
  obj: { [key: string]: { answer: EventOptions; name: string; role: Roles } } | undefined
) => {
  const initialResponses: Record<EventOptions, { name: string; role: string }[]> = { yes: [], no: [] };

  if (!obj) {
    return initialResponses;
  }

  const responses = { ...initialResponses };

  for (const key in obj) {
    const { answer, name, role } = obj[key];
    const roleLabel = getRoleLabel(role);
    if (answer === 'yes') {
      responses.yes.push({ name, role: roleLabel });
    } else {
      responses.no.push({ name, role: roleLabel });
    }
  }

  // Sort each category by role, then by name
  for (const option of Object.keys(responses) as EventOptions[]) {
    responses[option].sort((a, b) => {
      if (a.role === b.role) {
        return a.name.localeCompare(b.name); // Sort by name if roles are equal
      }
      return a.role.localeCompare(b.role); // Sort by role
    });
  }

  return responses;
};
