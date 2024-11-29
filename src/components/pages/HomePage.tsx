import { fetchMatchesSchedule } from '@/api';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const { data } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => fetchMatchesSchedule('volleyMania'),
  });
  console.log('data: ', data);
  return <div>HomePage</div>;
};

export { HomePage };
