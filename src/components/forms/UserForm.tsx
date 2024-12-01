import { fetchTeamMembers } from '@/api';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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

type Props = {
  email: string;
};

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Задължително поле' })
      .min(6, { message: 'Паролата трябва да бъде поне 6 символа' }),
    confirmPassword: z.string().min(1, { message: 'Задължително поле' }),
    selectedName: z.string({
      required_error: 'Задължително поле',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролите не съвпадат',
    path: ['confirmPassword'],
  });

export type FormSchema = z.infer<typeof formSchema>;

const UserForm = ({ email }: Props) => {
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => fetchTeamMembers(),
  });

  const { createUser, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (data: FormSchema) => {
      return await createUser(email, data.password, data.selectedName);
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
      password: '',
      confirmPassword: '',
      selectedName: '',
    },
  });

  const handleSubmit = (values: FormSchema) => {
    createUserMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="selectedName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Избери име" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Парола</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
                <Input type="password" {...field} />
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
