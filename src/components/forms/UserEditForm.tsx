import { updateDocument } from '@/api';
import {
  Button,
  buttonVariants,
  Checkbox,
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
import { OTHER_VALUE, SUPER_ADMIN_ID } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn } from '@/lib';
import { Roles } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FieldValue, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

type MappedData = {
  customName: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: Roles | null;
  memberId: string;
  modifiedAt: {
    isEqual: (other: FieldValue) => boolean;
  };
};

const formNames = z
  .object({
    member: z.string({ required_error: 'Задължително поле' }),
    names: z.string().optional(),
    role: z.string().optional(),
    isAdmin: z.boolean().default(false),
    isSuperAdmin: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.member === OTHER_VALUE) {
        // Ensure names is non-empty
        return typeof data.names === 'string' && data.names.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле',
      path: ['names'],
    }
  )
  .refine(
    (data) => {
      if (data.member === OTHER_VALUE) {
        // Ensure role is non-empty
        return typeof data.role === 'string' && data.role.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Задължително поле',
      path: ['role'],
    }
  );

export type Users = z.infer<typeof formNames>;
type FormValues = Omit<Users, 'id'>;

type Props = Partial<Users> & { id?: string; parentUrl: string; queryKey: string };

const UserEditForm = ({ id, parentUrl, queryKey, member, names, role, isAdmin, isSuperAdmin }: Props) => {
  const { data } = useData();
  const { members } = data;

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formNames),
    defaultValues: {
      member: member ?? '',
      names: names ?? '',
      role: role ?? '',
      isAdmin: isAdmin ?? false,
      isSuperAdmin: isSuperAdmin ?? false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (id) {
        const mappedData: MappedData = {
          customName: data.names || null,
          isAdmin: data.isAdmin,
          isSuperAdmin: data.isSuperAdmin,
          role: (data.role as Roles) || null,
          memberId: data.member,
          modifiedAt: serverTimestamp(),
        };

        await updateDocument(queryKey, id, mappedData);
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
          name="member"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('names', '');
                    form.setValue('role', '');
                  }}
                  value={field.value}
                  name={field.name}>
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
              name="names"
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
              name="role"
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
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={id === SUPER_ADMIN_ID} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Админ</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isSuperAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={id === SUPER_ADMIN_ID} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Суперадмин</FormLabel>
              </div>
            </FormItem>
          )}
        />

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
