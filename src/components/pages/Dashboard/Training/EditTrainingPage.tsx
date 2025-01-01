import { fetchDocument } from '@/api';
import { TrainingForm, Training, FormCard } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  description: string;
  parentUrl: string;
};

const EditTrainingPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();
  const { data, isFetched } = useQuery({
    enabled: !!id,
    queryKey: [queryKey, id],
    queryFn: () => fetchDocument<Training>(queryKey, id!),
  });

  if (!isFetched) {
    return null;
  }

  if (!data && isFetched) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <TrainingForm {...data} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditTrainingPage };
