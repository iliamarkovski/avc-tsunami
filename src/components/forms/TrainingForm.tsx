import { fetchAllDocuments } from '@/api';
import {
  Button,
  buttonVariants,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Names,
} from '@/components';
import { db } from '@/config';
import { DEFAULT_HALL_ID, HALLS_KEY } from '@/constants';
import { toast } from '@/hooks';
import { cn, getDateByTimestamp } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { CalendarIcon, Loader2 } from 'lucide-react';
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

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue('dateTime', date);
    }
  }

  function handleTimeChange(type: 'hour' | 'minute', value: string) {
    const currentDate = form.getValues('dateTime') || new Date();
    const newDate = new Date(currentDate);

    if (type === 'hour') {
      const hour = Math.max(0, Math.min(23, parseInt(value, 10)));
      newDate.setHours(hour);
    } else if (type === 'minute') {
      const minute = Math.max(0, Math.min(59, parseInt(value, 10)));
      newDate.setMinutes(minute);
    }

    form.setValue('dateTime', newDate);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата и час</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'dd.MM.yyyy HH:mm') : <span>Избери дата и час</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect}
                      initialFocus
                      defaultMonth={field.value}
                    />
                    <div className="flex flex-col divide-y border-t sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex p-2 sm:flex-col">
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={field.value && field.value.getHours() === hour ? 'default' : 'ghost'}
                              className="aspect-square shrink-0 sm:w-full"
                              onClick={() => handleTimeChange('hour', hour.toString())}>
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex p-2 sm:flex-col">
                          {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                            <Button
                              key={minute}
                              size="icon"
                              variant={field.value && field.value.getMinutes() === minute ? 'default' : 'ghost'}
                              className="aspect-square shrink-0 sm:w-full"
                              onClick={() => handleTimeChange('minute', minute.toString())}>
                              {minute.toString().padStart(2, '0')}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Позиция</FormLabel>
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
