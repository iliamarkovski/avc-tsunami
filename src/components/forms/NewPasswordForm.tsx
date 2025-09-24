import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail, type Auth } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useMutation } from '@tanstack/react-query';
import { auth } from '@/config';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks';

const newPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Задължително поле' }).email({ message: 'Невалиден имейл' }),
});

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

type ActionCodeSettings = {
  url: string;
  handleCodeInApp: boolean;
};

type SendEmail = { auth: Auth; email: string; actionCodeSettings: ActionCodeSettings };

export const NewPasswordForm = () => {
  const { toast } = useToast();

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: sendEmail, isPending: sendEmailLoading } = useMutation({
    mutationFn: async ({ auth, email, actionCodeSettings }: SendEmail) =>
      await sendPasswordResetEmail(auth, email, actionCodeSettings),
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Линк за задаване на нова парола беше изпратен на вашия имейл',
        description: 'Ако не виждате имейла, моля проверете папка "Спам" или "Нежелана поща"',
      });
      form.reset();
    },
    onError: (e) => {
      const error = e as FirebaseError;
      switch (error.code) {
        case 'auth/user-not-found':
          form.setError('email', {
            message: 'Потребител с такъв имейл не е намерен',
          });
          break;
        case 'auth/invalid-email':
          form.setError('email', {
            message: 'Невалиден имейл',
          });
          break;
        case 'auth/too-many-requests':
          toast({
            variant: 'destructive',
            description: 'Твърде много опити за влизане. Моля, опитайте отново по-късно',
          });
          break;
        default:
          toast({
            variant: 'destructive',
            description: 'Възникна грешка. Моля, опитайте отново по-късно',
          });
          break;
      }
    },
  });

  const handleSubmit = async (formData: NewPasswordSchema) => {
    const { email } = formData;

    const actionCodeSettings: ActionCodeSettings = {
      url: import.meta.env.VITE_RESET_WATCHWORD_URL,
      handleCodeInApp: false, // Keep false unless handling within your app
    };

    sendEmail({ auth, email, actionCodeSettings });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имейл</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-8 w-full" disabled={sendEmailLoading}>
          {sendEmailLoading ? <Loader2 className="animate-spin" /> : null}
          Заяви
        </Button>

        <Button asChild variant="link" size="link">
          <Link to="/login">
            <ArrowLeft />
            Обратно към вход
          </Link>
        </Button>
      </form>
    </Form>
  );
};
