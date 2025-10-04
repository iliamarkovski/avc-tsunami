import { addDocument, updateDocument } from '@/api';
import {
  Button,
  buttonVariants,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components';
import { LATEST_VERSION } from '@/constants';
import { toast } from '@/hooks';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  major: z.string().min(1, { message: 'Задължително поле' }).regex(/^\d+$/, { message: 'Само числа' }),
  minor: z.string().min(1, { message: 'Задължително поле' }).regex(/^\d+$/, { message: 'Само числа' }),
  patch: z.string().min(1, { message: 'Задължително поле' }).regex(/^\d+$/, { message: 'Само числа' }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: string;
  parentUrl: string;
  queryKey: string;
  version?: string;
};

export type Version = {
  id: string;
  version: string;
};

const VersionForm = ({ id, parentUrl, queryKey, version }: Props) => {
  const navigate = useNavigate();

  const [major = '1', minor = '0', patch = '0'] = version?.split('.') ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      major,
      minor,
      patch,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const combinedVersion = `${data.major}.${data.minor}.${data.patch}`;

      if (id) {
        await updateDocument(queryKey, id, { version: combinedVersion });
      } else {
        await addDocument(queryKey, { version: combinedVersion });
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
        <div>
          <FormLabel>Версия</FormLabel>
          <FormDescription>Последна версия: {LATEST_VERSION}</FormDescription>
        </div>

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minor"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Minor</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patch"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Patch</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="!mt-8 flex gap-4">
          <Link to={parentUrl} className={cn(buttonVariants({ variant: 'outline' }))}>
            Отказ
          </Link>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : null}
            {id ? 'Запази' : 'Добави'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { VersionForm };
