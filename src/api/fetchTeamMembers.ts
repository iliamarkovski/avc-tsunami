import { fetchData } from '@/api';

type DataProps = {
  teamMembers: {
    id: string;
    names: string;
  }[];
};

export const fetchTeamMembers = async () => {
  const res = await fetchData<DataProps>(`{
    teamMembers {
      id
      names
    }
  }`);

  return res?.teamMembers;
};
