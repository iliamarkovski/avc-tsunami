import { fetchDocument } from '@/api';
import { MemberForm, Card, CardContent, CardDescription, CardHeader, CardTitle, Members } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  description: string;
  parentUrl: string;
};

const EditMemberPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();
  const { data, isFetched } = useQuery({
    enabled: !!id,
    queryKey: [queryKey, id],
    queryFn: () => fetchDocument<Members>(queryKey, id!),
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
        <MemberForm {...data} id={id} parentUrl={parentUrl} queryKey={queryKey} />
      </CardContent>
    </Card>
  );
};

export { EditMemberPage };
