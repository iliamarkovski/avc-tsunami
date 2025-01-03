import { Avatar, AvatarFallback, AvatarImage, Card, CardHeader, Separator } from '@/components';
import { useData } from '@/contexts';
import { getRoleLabel } from '@/lib';
import { Roles } from '@/types';
import { User } from 'lucide-react';
import { useMemo } from 'react';

const TeamMembersPage = () => {
  const { data } = useData();
  const { members } = data;

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return [...members].filter((item) => item.active).sort((a, b) => Number(a.number) - Number(b.number));
  }, [members]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {filteredMembers.map((member) => {
        return (
          <Card key={member.id} className="flex flex-col">
            <CardHeader className="grow items-center gap-2 p-4 text-center">
              <Avatar className="aspect-square h-auto w-5/6 border">
                <AvatarImage src={undefined} className="object-cover" />
                <AvatarFallback>
                  <User className="h-3/5 w-3/5 text-background" />
                </AvatarFallback>
              </Avatar>
              <div className="flex grow flex-col">
                <p className="mb-2 text-lg"># {member.number}</p>
                <h2 className="mb-auto text-xl font-semibold">
                  {member.names} {member.captain ? '(к)' : null}
                </h2>
                <Separator className="mb-2 mt-3" />
                <p className="mt-auto text-sm">{getRoleLabel(member.role as Roles)}</p>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

export { TeamMembersPage };
