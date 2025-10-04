import { TrainingForm, FormCard, Training } from '@/components';
import { QUERY_KEYS } from '@/constants';
import { useLiveData } from '@/hooks';
import { getDataById } from '@/lib';
import { QueryKeys } from '@/types';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const EditTrainingPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data: training, loading: trainingLoading } = useLiveData<Training[]>(QUERY_KEYS.TRAINING);
  const event = getDataById<Training>(training, id);

  if (trainingLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <FormCard title={title} description={description}>
      <TrainingForm
        dateTime={event?.dateTime}
        hall={event?.hall}
        message={event?.message}
        id={id}
        parentUrl={parentUrl}
        queryKey={queryKey}
      />
    </FormCard>
  );
};

export { EditTrainingPage };
