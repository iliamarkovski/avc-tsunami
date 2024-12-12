import { fetchTeamMembers } from '@/api';
import { Avatar, AvatarFallback, AvatarImage, Card, CardHeader, Separator } from '@/components';
import { User } from 'lucide-react';
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
          <Card key={member.id} className="flex flex-col">
            <CardHeader className="grow items-center gap-2 p-4 text-center">
              <Avatar className="aspect-square h-auto w-5/6 border">
                <AvatarImage src={undefined} />
                <AvatarFallback>
                  <User className="h-3/5 w-3/5 text-background" />
                </AvatarFallback>
              </Avatar>
              <div className="flex grow flex-col">
                <p className="mb-2 text-lg"># {member.number}</p>
                <h2 className="mb-auto text-xl font-semibold">
                  {member.names} {member.captain ? '(к)' : null}
                </h2>
                <Separator className="my-3" />
                <p className="mt-auto text-sm">{getRoleLabel(member.role)}</p>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

TeamMembers.displayName = 'TeamMembers';

export { TeamMembers };
