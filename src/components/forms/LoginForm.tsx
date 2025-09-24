import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from '@/components';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts';
import { UserRegistrationForm } from '@/components';
import { useState } from 'react';
import { useToast } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().min(1, { message: 'Задължително поле' }).email({ message: 'Невалиден имейл' }),
  password: z
    .string()
    .min(1, { message: 'Задължително поле' })
    .min(6, { message: 'Паролата трябва да бъде поне 6 символа' }),
});

export type LoginSchema = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login, isUserExist } = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isUserExistMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      return await isUserExist(data.email);
    },
    onSuccess: (userExist) => {
      if (userExist) {
        form.setError('password', {
          type: 'manual',
          message: 'Грешна парола',
        });
      } else {
        setShowUserForm(true);
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      return await login(data.email, data.password);
    },
    onSuccess: () => {
      navigate('/');
      localStorage.clear();
    },
    onError: (data: FirebaseError) => {
      switch (data.code) {
        case 'auth/wrong-password':
          form.setError('password', {
            type: 'manual',
            message: 'Грешна парола',
          });
          break;

        case 'auth/user-not-found':
          form.setError('email', {
            type: 'manual',
            message: 'Потребител с такъв имейл не е намерен',
          });
          break;

        case 'auth/too-many-requests':
          toast({
            variant: 'destructive',
            title: 'Твърде много опити за влизане',
            description: 'Моля, опитайте отново по-късно',
          });
          break;

        default:
          toast({
            variant: 'destructive',
            title: 'Възникна грешка',
            description: 'Моля, опитайте отново по-късно',
          });
          break;
      }
    },
  });

  const isLoading = isUserExistMutation.isPending || loginMutation.isPending;

  const handleSubmit = (values: LoginSchema) => {
    if (values.password === import.meta.env.VITE_UNI_PASS) {
      isUserExistMutation.mutate(values);
    } else {
      loginMutation.mutate(values);
    }
  };

  if (showUserForm) {
    return <UserRegistrationForm email={form.watch('email')} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" autoComplete="off">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Парола</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="!mt-8 w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Вход
        </Button>

        <div className="flex justify-end">
          <Button asChild variant="link" size="link">
            <Link to="/new-password">Заяви нова парола</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { LoginForm };
