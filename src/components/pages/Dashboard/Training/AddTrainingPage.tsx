import { TrainingForm, FormCard } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddTrainingPage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <FormCard title={title} description={description}>
      <TrainingForm parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { AddTrainingPage };
