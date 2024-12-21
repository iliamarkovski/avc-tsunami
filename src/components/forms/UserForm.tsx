import { fetchAllDocuments } from '@/api';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Members,
  PasswordInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/contexts';
import { useToast } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Roles } from '@/types';
import { useMemo } from 'react';
import { MEMBERS_KEY } from '@/constants';

type Props = {
  email: string;
};

const OTHER_VALUE = 'other';

const formSchema = z
  .object({
    selectedName: z.string().min(1, { message: 'Задължително поле' }),
    customName: z.string().optional(),
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
      if (data.selectedName === OTHER_VALUE) {
        // Explicitly handle undefined and check for non-empty string
        return typeof data.customName === 'string' && data.customName.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле"',
      path: ['customName'],
    }
  );

export type FormSchema = z.infer<typeof formSchema>;

const UserForm = ({ email }: Props) => {
  const { data: teamMembers } = useQuery({
    queryKey: [MEMBERS_KEY],
    queryFn: () => fetchAllDocuments<Members>(MEMBERS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  const sortedTeamMembers = useMemo(() => {
    if (!teamMembers) return [];
    return [...teamMembers].sort((a, b) => a.names.localeCompare(b.names));
  }, [teamMembers]);

  const { createUser, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      const { password, selectedName, customName } = data;
      const role = sortedTeamMembers.find((member) => member.names === selectedName)?.role || OTHER_VALUE;
      const name = selectedName === OTHER_VALUE ? (customName as string) : selectedName;

      return await createUser(email, password, name, role as Roles);
    },
    onSuccess: (_, variables) => {
      loginMutation.mutate(variables);
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
    mutationFn: async (data: FormSchema) => {
      return await login(email, data.password);
    },
    onSuccess: () => {
      navigate('/');
    },
    onError: () => {
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
      selectedName: undefined,
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
          name="selectedName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value} name={field.name}>
                  <SelectTrigger id="selectedName">
                    <SelectValue placeholder="Избери име" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.names}>
                        {member.names}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Друг</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('selectedName') === OTHER_VALUE ? (
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

export { UserForm };
