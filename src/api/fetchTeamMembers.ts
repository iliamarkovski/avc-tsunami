import { fetchData } from '@/api';
import { Roles } from '@/types';

type DataProps = {
  teamMembers: {
    id: string;
    names: string;
    number: number;
    role: Roles;
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
