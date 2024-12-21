import { NameForm, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddNamePage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <NameForm parentUrl={parentUrl} queryKey={queryKey} />
      </CardContent>
    </Card>
  );
};

export { AddNamePage };
