import { TrainingForm, FormCard, Training } from '@/components';
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

const EditTrainingPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const event = getDataById<Training>(data[queryKey] as Training[], id);

  if (!event) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <TrainingForm {...event} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditTrainingPage };
