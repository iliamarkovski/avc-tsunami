import { FormCard, VersionForm } from '@/components';
import { QueryKeys } from '@/types';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const AddVersionPage = ({ queryKey, title, description, parentUrl }: Props) => {
  return (
    <FormCard title={title} description={description}>
      <VersionForm parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { AddVersionPage };
