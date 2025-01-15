import { FormCard, VersionForm } from '@/components';
import { useData } from '@/contexts';
import { QueryKeys } from '@/types';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const EditVersionPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const { version } = data;

  if (!version) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <VersionForm version={version.version} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditVersionPage };
