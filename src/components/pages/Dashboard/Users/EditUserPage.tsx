import { UserEditForm, FormCard } from '@/components';
import { EnrichedUser, useData } from '@/contexts';
import { getDataById } from '@/lib';
import { QueryKeys } from '@/types';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const EditUserPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const user = getDataById<EnrichedUser>(data[queryKey] as EnrichedUser[], id);

  if (!user) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <UserEditForm
        isAdmin={user.isAdmin}
        isSuperAdmin={user.isSuperAdmin}
        member={user.memberId}
        names={user.names}
        role={user.role}
        id={id}
        parentUrl={parentUrl}
        queryKey={queryKey}
      />
    </FormCard>
  );
};

export { EditUserPage };
