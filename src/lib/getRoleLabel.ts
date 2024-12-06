import { Roles } from '@/types';

const ROLES: Record<Roles, string> = {
  setter: 'Разпределител',
  receiver: 'Посрещач',
  opposite: 'Диагонал',
  blocker: 'Блокировач',
  libero: 'Либеро',
};

export const getRoleLabel = (role: Roles) => {
  return ROLES[role];
};
