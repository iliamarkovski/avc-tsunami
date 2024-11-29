import { fetchTeamMembers } from '@/api';
import { useQuery } from '@tanstack/react-query';

const TeamMembers = () => {
  const { data } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => fetchTeamMembers(),
  });

  return (
    <div>
      {data?.map((member) => {
        return <p key={member.id}>{member.names}</p>;
      })}
    </div>
  );
};

TeamMembers.displayName = 'TeamMembers';

export { TeamMembers };
