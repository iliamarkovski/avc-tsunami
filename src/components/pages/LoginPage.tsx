import { Card, CardContent, CardDescription, CardHeader, CardTitle, LoginForm } from '@/components';

const LoginPage = () => {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>Въведете данните си по-долу</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export { LoginPage };
