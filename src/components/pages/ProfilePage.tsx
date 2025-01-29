import { ProfileForm, FormCard } from '@/components';

const ProfilePage = () => {
  return (
    <FormCard
      title="Редактиране на профил"
      description='Може да качите или премахнете снимката си, тя ще бъде видима на страницата "Отбор"'>
      <ProfileForm />
    </FormCard>
  );
};

export { ProfilePage };
