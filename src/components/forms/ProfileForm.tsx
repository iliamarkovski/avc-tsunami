import { updateDocument } from '@/api';
import {
  Button,
  buttonVariants,
  Checkbox,
  CircularImageCrop,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@/components';
import { OTHER_VALUE, QUERY_KEYS } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn, getRoleLabel } from '@/lib';
import { Roles } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formNames = z.object({
  names: z.string().optional(),
  role: z.string().optional(),
  number: z.string().optional(),
  active: z.boolean().default(false).optional(),
  captain: z.boolean().default(false).optional(),
  profileImage: z.string().nullable().optional(),
});

type User = z.infer<typeof formNames>;

const ProfileForm = () => {
  const navigate = useNavigate();
  const { data } = useData();
  const { members, loggedInUser } = data;
  const [isLoading, setIsLoading] = useState(false);

  const memberUser = members.find((member) => member.id === loggedInUser?.memberId);

  const isOtherMember = loggedInUser?.memberId === OTHER_VALUE;

  const form = useForm<User>({
    resolver: zodResolver(formNames),
    defaultValues: {
      names: isOtherMember ? loggedInUser.names : memberUser?.names,
      role: isOtherMember ? getRoleLabel(loggedInUser.role) : getRoleLabel(memberUser?.role as Roles),
      active: isOtherMember ? false : memberUser?.active,
      captain: isOtherMember ? false : memberUser?.captain,
      number: isOtherMember ? '' : memberUser?.number && +memberUser.number < 0 ? '' : memberUser?.number,
      profileImage: loggedInUser?.image || '',
    },
  });

  const isDirty = form.formState.isDirty;

  const { mutate, isPending } = useMutation({
    mutationFn: async (image: string) => {
      await updateDocument(QUERY_KEYS.MEMBERS, loggedInUser?.memberId!, { image });
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

  const handleSubmit = async (data: User) => {
    setIsLoading(true);

    await mutate(data.profileImage || '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <CircularImageCrop onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имена</FormLabel>
              <FormControl>
                <Input {...field} type="text" disabled />
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
              <FormControl>
                <Input {...field} type="text" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер</FormLabel>
              <FormControl>
                <Input {...field} type="number" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <Label className="flex cursor-not-allowed flex-row items-center gap-2 rounded-md border p-4 opacity-50">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              Картотекиран
            </Label>
          )}
        />

        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <Label className="flex cursor-not-allowed flex-row items-center gap-2 rounded-md border p-4 opacity-50">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              Капитан
            </Label>
          )}
        />

        <div className="!mt-8 flex gap-4">
          <Link to="/" className={cn(buttonVariants({ variant: 'outline' }))}>
            Отказ
          </Link>

          <Button type="submit" disabled={isLoading || isPending || !isDirty} className="w-full">
            {isLoading || isPending ? <Loader2 className="animate-spin" /> : null}
            Запази
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ProfileForm };
