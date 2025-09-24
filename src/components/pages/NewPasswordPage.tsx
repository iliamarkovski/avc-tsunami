import { FormCard, NewPasswordForm } from '@/components';

const NewPasswordPage = () => {
  return (
    <FormCard title="Нова парола" description="Въведете имейлът, с който сте се регистрирали">
      <NewPasswordForm />
    </FormCard>
  );
};

export { NewPasswordPage };
