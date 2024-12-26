import { fetchDocument } from '@/api';
import { NameForm, Names, FormCard } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  description: string;
  parentUrl: string;
};

const EditNamePage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();
  const { data, isFetched } = useQuery({
    enabled: !!id,
    queryKey: [queryKey, id],
    queryFn: () => fetchDocument<Names>(queryKey, id!),
    staleTime: 60 * 60 * 1000,
  });

  if (!isFetched) {
    return null;
  }

  if (!data && isFetched) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <NameForm {...data} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditNamePage };
