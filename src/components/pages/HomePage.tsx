import { fetchTeamMembers } from '@/api';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const { data } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => fetchTeamMembers(),
  });

  console.log('data: ', data);

  return <div>HomePage</div>;
};

export { HomePage };
