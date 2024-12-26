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
} from '@/components';
import { db } from '@/config';
import { toast } from '@/hooks';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formNames = z.object({
  name: z.string().min(1, { message: 'Задължително поле' }),
});

export type Names = z.infer<typeof formNames>;

type Props = Partial<Names> & { id?: string; parentUrl: string; queryKey: string };

const NameForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<Names>({
    resolver: zodResolver(formNames),
    defaultValues: {
      name: props.name ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Names) => {
      if (id) {
        const teamRef = doc(db, queryKey, id);
        await updateDoc(teamRef, data);
      } else {
        const collectionRef = collection(db, queryKey);
        await addDoc(collectionRef, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
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

  const handleSubmit = async (value: Names) => {
    mutate(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
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

export { NameForm };
