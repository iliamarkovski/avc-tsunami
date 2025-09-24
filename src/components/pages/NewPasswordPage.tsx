import { FormCard, NewPasswordForm } from '@/components';

const NewPasswordPage = () => {
  return (
    <FormCard title="Нова парола" description="Въведете имейла, с който сте се регистрирали">
      <NewPasswordForm />
    </FormCard>
  );
};

export { NewPasswordPage };
