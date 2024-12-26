import { MatchForm, FormCard } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddMatchPage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <FormCard title={title} description={description}>
      <MatchForm parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { AddMatchPage };
