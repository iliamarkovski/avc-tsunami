import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';
import { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

const FormCard = ({ title, description, children }: Props) => {
  return (
    <Card className="mx-auto w-full max-w-sm space-y-6 p-5 sm:p-6">
      <CardHeader className="!p-0">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="!p-0">{children}</CardContent>
    </Card>
  );
};

export { FormCard };
