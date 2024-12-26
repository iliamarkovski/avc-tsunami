import { MatchForm, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddMatchPage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <MatchForm parentUrl={parentUrl} queryKey={queryKey} />
      </CardContent>
    </Card>
  );
};

export { AddMatchPage };
