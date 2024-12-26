import { fetchAllDocuments } from '@/api';
import {
  Button,
  buttonVariants,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Names,
  DateTimePicker,
} from '@/components';
import { db } from '@/config';
import { DEFAULT_HALL_ID, HALLS_KEY } from '@/constants';
import { toast } from '@/hooks';
import { cn, getDateByTimestamp } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  dateTime: z.date({
    required_error: 'Задължително поле',
  }),
  hall: z.string().min(1, { message: 'Задължително поле' }),
});

export type Training = z.infer<typeof formSchema>;

type Props = Partial<Training> & { id?: string; parentUrl: string; queryKey: string };

const TrainingForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: halls } = useQuery({
    queryKey: [HALLS_KEY],
    queryFn: () => fetchAllDocuments<Names>(HALLS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  const sortedHalls = useMemo(() => {
    if (!halls) return [];
    return [...halls].sort((a, b) => a.name.localeCompare(b.name));
  }, [halls]);

  const form = useForm<Training>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: props.dateTime ? getDateByTimestamp(props.dateTime) : undefined,
      hall: props.hall ?? DEFAULT_HALL_ID,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Training) => {
      if (id) {
        const docRef = doc(db, queryKey, id);
        await updateDoc(docRef, data);
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

  const handleSubmit = async (value: Training) => {
    mutate(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DateTimePicker<Training> formControl={form.control} name="dateTime" />

        <FormField
          control={form.control}
          name="hall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Зала</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете зала" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedHalls?.map((hall) => {
                    return (
                      <SelectItem key={hall.id} value={hall.id}>
                        {hall.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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

export { TrainingForm };
