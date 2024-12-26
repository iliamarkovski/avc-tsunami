import { NameForm, FormCard } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddNamePage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <FormCard title={title} description={description}>
      <NameForm parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { AddNamePage };
