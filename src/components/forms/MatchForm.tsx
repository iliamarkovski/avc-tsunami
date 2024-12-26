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
  Input,
  Checkbox,
} from '@/components';
import { db } from '@/config';
import { HALLS_KEY, TEAM_NAME, TEAMS_KEY } from '@/constants';
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
  opponent: z.string().min(1, { message: 'Задължително поле' }),
  host: z.boolean().default(false),
  gamesHost: z.string(),
  gamesGuest: z.string(),
  youtubeLink: z.string(),
});

export type Matches = z.infer<typeof formSchema>;

type Props = Partial<Matches> & { id?: string; parentUrl: string; queryKey: string };

const MatchForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
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

  const { data: opponents } = useQuery({
    queryKey: [TEAMS_KEY],
    queryFn: () => fetchAllDocuments<Names>(TEAMS_KEY),
    staleTime: 60 * 60 * 1000,
  });

  const sortedOpponents = useMemo(() => {
    if (!opponents) return [];
    return [...opponents].sort((a, b) => a.name.localeCompare(b.name));
  }, [opponents]);

  const form = useForm<Matches>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: props.dateTime ? getDateByTimestamp(props.dateTime) : undefined,
      hall: props.hall ?? '',
      opponent: props.opponent ?? '',
      host: props.host ?? false,
      gamesHost: props.gamesHost ?? '',
      gamesGuest: props.gamesGuest ?? '',
      youtubeLink: props.youtubeLink ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Matches) => {
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

  const handleSubmit = async (value: Matches) => {
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

        <FormField
          control={form.control}
          name="opponent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Противник</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете противник" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedOpponents?.map((opponent) => {
                    return (
                      <SelectItem key={opponent.id} value={opponent.id}>
                        {opponent.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{TEAM_NAME} домакин?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gamesHost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Геймове домакин</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gamesGuest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Геймове гост</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtubeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Видео запис</FormLabel>
              <FormControl>
                <Input {...field} />
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

export { MatchForm };
