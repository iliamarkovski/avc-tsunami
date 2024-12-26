import { fetchDocument } from '@/api';
import { TrainingForm, Card, CardContent, CardDescription, CardHeader, CardTitle, Training } from '@/components';
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
    staleTime: 60 * 60 * 1000,
  });

  if (!isFetched) {
    return null;
  }

  if (!data && isFetched) {
    return <p>Not Found</p>;
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <TrainingForm {...data} id={id} parentUrl={parentUrl} queryKey={queryKey} />
      </CardContent>
    </Card>
  );
};

export { EditTrainingPage };
