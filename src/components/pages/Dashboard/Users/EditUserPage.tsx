import { UserEditForm, FormCard } from '@/components';
import { useData } from '@/contexts';
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
  const user = getDataById(data[queryKey], id);

  if (!user) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <UserEditForm {...user} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditUserPage };
