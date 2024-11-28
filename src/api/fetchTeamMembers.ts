import { fetchData } from '@/api';
import { TeamMembers } from '@/types';

export const fetchTeamMembers = async () => {
  const res = await fetchData<TeamMembers>(`{
    teamMembers {
      names
    }
  }`);

  return res?.teamMembers;
};
