import { TrainingForm, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddTrainingPage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <TrainingForm parentUrl={parentUrl} queryKey={queryKey} />
      </CardContent>
    </Card>
  );
};

export { AddTrainingPage };
