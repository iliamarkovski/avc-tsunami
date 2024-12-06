import { fetchTeamMembers } from '@/api';
import { Card, CardHeader } from '@/components';
import { getRoleLabel } from '@/lib';
import { useQuery } from '@tanstack/react-query';

const TeamMembers = () => {
  const { data } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => fetchTeamMembers(true),
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.map((member) => {
        return (
          <Card key={member.id}>
            <CardHeader>
              <h2 key={member.id}>
                {member.names} {member.captain ? '(к)' : null}
              </h2>
              <p>{getRoleLabel(member.role)}</p>
              <span>{member.number}</span>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

TeamMembers.displayName = 'TeamMembers';

export { TeamMembers };
