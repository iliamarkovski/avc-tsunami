import { OTHER_VALUE } from '@/constants';
import { useData, useAuth } from '@/contexts';
import { Roles } from '@/types';

export const useUserInfo = (id?: string): { names: string; role: Roles; isActive: boolean } => {
  const { user } = useAuth();
  const { data } = useData();
  const { members, users } = data;

  const foundUser = id ? users.find((u) => u.id === id) : user;
  const memberId = foundUser?.memberId;

  if (memberId === OTHER_VALUE) {
    return {
      names: foundUser?.customName || '',
      role: foundUser?.role as Roles,
      isActive: false,
    };
  }

  const member = members.find((m) => m.id === memberId);

  return {
    names: member?.names || '',
    role: member?.role as Roles,
    isActive: member?.active || false,
  };
};
