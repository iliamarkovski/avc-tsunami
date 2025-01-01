import { NameForm, FormCard } from '@/components';
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

const EditNamePage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const name = getDataById(data[queryKey], id);

  if (!name) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <NameForm {...name} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditNamePage };
