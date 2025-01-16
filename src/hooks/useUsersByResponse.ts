import { useData } from '@/contexts';
import { getRoleLabel } from '@/lib';
import { EventOptions, Roles } from '@/types';

type UserResponse = {
  names: string;
  role: string;
  id: string;
  isMember: boolean;
};

export const useUsersByResponse = (
  responses: Record<string, { answer: EventOptions }> | undefined
): Record<EventOptions, UserResponse[]> => {
  // Initialize the mapped responses with empty arrays for each option
  const initialResponses: Record<EventOptions, UserResponse[]> = { yes: [], no: [] };

  if (!responses) {
    return initialResponses;
  }

  const { data } = useData();
  const { loggedInUser } = data;

  if (!loggedInUser) {
    return initialResponses;
  }

  const mappedResponses: Record<EventOptions, UserResponse[]> = { ...initialResponses };

  for (const [userId, { answer }] of Object.entries(responses)) {
    // Safely check if userData exists
    if (!loggedInUser) {
      console.warn(`User with ID ${userId} not found in the data.`);
      continue;
    }

    const roleLabel = getRoleLabel(loggedInUser.role as Roles);
    const userResponse: UserResponse = {
      names: loggedInUser.names,
      role: roleLabel,
      id: userId,
      isMember: loggedInUser.isMember,
    };

    mappedResponses[answer]?.push(userResponse);
  }

  // Sort each response group
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
