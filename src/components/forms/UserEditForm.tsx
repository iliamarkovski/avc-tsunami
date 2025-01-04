import {
  Button,
  buttonVariants,
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
import { db } from '@/config';
import { OTHER_VALUE } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formNames = z
  .object({
    selectedName: z.string({ required_error: 'Задължително поле' }),
    customName: z.string().optional(),
    selectedRole: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.selectedName === OTHER_VALUE) {
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
      if (data.selectedName === OTHER_VALUE) {
        // Ensure selectedRole is non-empty
        return typeof data.selectedRole === 'string' && data.selectedRole.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле',
      path: ['selectedRole'],
    }
  );

export type Users = z.infer<typeof formNames>;
type FormValues = Omit<Users, 'id'>;

type Props = Partial<Users> & { id?: string; parentUrl: string; queryKey: string };

const UserEditForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
  const { data } = useData();
  const { members } = data;

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formNames),
    defaultValues: {
      selectedName: props.selectedName ?? '',
      customName: props.customName ?? '',
      selectedRole: props.selectedRole ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (id) {
        const teamRef = doc(db, queryKey, id);
        await updateDoc(teamRef, data);
      } else {
        const collectionRef = collection(db, queryKey);
        await addDoc(collectionRef, data);
      }
    },
    onSuccess: () => {
      navigate(parentUrl);
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

  const handleSubmit = async (value: FormValues) => {
    mutate(value);
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
                <Select onValueChange={(value) => field.onChange(value)} value={field.value} name={field.name}>
                  <SelectTrigger id="selectedName">
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

        {form.watch('selectedName') === OTHER_VALUE ? (
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

        <div className="!mt-8 flex gap-4">
          <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
            Отказ
          </Link>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : null}
            {id ? 'Промени' : 'Добави'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { UserEditForm };
