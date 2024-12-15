import { Roles } from '@/types';

const ROLES: Record<Roles, string> = {
  setter: 'Разпределител',
  receiver: 'Посрещач',
  opposite: 'Диагонал',
  blocker: 'Блокировач',
  libero: 'Либеро',
  coach: 'Треньор',
  other: '?',
};

export const getRoleLabel = (role: Roles) => {
  return ROLES[role];
};
