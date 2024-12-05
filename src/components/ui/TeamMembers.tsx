import { fetchTeamMembers } from '@/api';
import { Card, CardHeader } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { MemberRole } from '@/api';

const roles: Record<MemberRole, string> = {
  setter: 'Разпределител',
  receiver: 'Посрещач',
  opposite: 'Диагонал',
  blocker: 'Блокировач',
  libero: 'Либеро',
};

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
              <p>{roles[member.role]}</p>
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
