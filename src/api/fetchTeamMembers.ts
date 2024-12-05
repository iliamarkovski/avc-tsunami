import { fetchData } from '@/api';

export type MemberRole = 'setter' | 'opposite' | 'receiver' | 'blocker' | 'libero';

type DataProps = {
  teamMembers: {
    id: string;
    names: string;
    number: number;
    role: MemberRole;
    captain: boolean;
    active: boolean;
  }[];
};

export const fetchTeamMembers = async (active?: boolean) => {
  const res = await fetchData<DataProps>(`{
    teamMembers(first: 50, orderBy: ${active ? 'number_ASC' : 'names_ASC'} ${active ? ', where: {active: true}' : ''}) {
      id
      names
      number
      role
      captain
      active
    }
  }`);

  return res?.teamMembers;
};
