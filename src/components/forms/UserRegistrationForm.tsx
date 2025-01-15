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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth, useData } from '@/contexts';
import { useToast } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Roles } from '@/types';
import { OTHER_VALUE } from '@/constants';

type Props = {
  email: string;
};

const formSchema = z
  .object({
    member: z.string({ required_error: 'Задължително поле' }),
    customName: z.string().optional(),
    selectedRole: z.string().optional(),
    password: z
      .string()
      .min(1, { message: 'Задължително поле' })
      .min(6, { message: 'Паролата трябва да бъде поне 6 символа' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Задължително поле' })
      .min(6, { message: 'Паролата трябва да бъде поне 6 символа' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролите не съвпадат',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.member === OTHER_VALUE) {
        // Ensure customName is non-empty
        return typeof data.customName === 'string' && data.customName.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле',
      path: ['customName'],
    }
  )
  .refine(
    (data) => {
      if (data.member === OTHER_VALUE) {
        // Ensure selectedRole is non-empty
        return typeof data.selectedRole === 'string' && data.selectedRole.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле',
      path: ['selectedRole'],
    }
  )
  .refine((data) => data.password !== import.meta.env.VITE_UNI_PASS, {
    message: 'Моля, изберете друга парола',
    path: ['password'],
  });

export type FormSchema = z.infer<typeof formSchema>;

const UserRegistrationForm = ({ email }: Props) => {
  const { data } = useData();
  const { members } = data;

  const { createUser, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      const { password, member, customName, selectedRole } = data;

      return await createUser(email, password, member, selectedRole as Roles, customName);
    },
    onSuccess: (_, variables) => {
      loginMutation.mutate(variables);
    },
    onError: (error) => {
      console.error('error: ', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      return await login(email, data.password);
    },
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('error: ', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const isLoading = createUserMutation.isPending || loginMutation.isPending;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member: undefined,
      password: '',
      confirmPassword: '',
      customName: '',
    },
  });

  const handleSubmit = (values: FormSchema) => {
    createUserMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" autoComplete="off">
        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value} name={field.name}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Избери име" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id!}>
                        {member.names}
                      </SelectItem>
                    ))}
                    <SelectItem value={OTHER_VALUE}>Друг</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('member') === OTHER_VALUE ? (
          <>
            <FormField
              control={form.control}
              name="customName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име и фамилия</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Позиция</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Изберете позиция" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blocker">Блокировач</SelectItem>
                      <SelectItem value="opposite">Диагонал</SelectItem>
                      <SelectItem value="libero">Либеро</SelectItem>
                      <SelectItem value="receiver">Посрещач</SelectItem>
                      <SelectItem value="setter">Разпределител</SelectItem>
                      <SelectItem value="coach">Треньор</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}

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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повтори парола</FormLabel>
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
      </form>
    </Form>
  );
};

export { UserRegistrationForm };
