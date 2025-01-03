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
  Input,
  Checkbox,
  DateTimePicker,
} from '@/components';
import { db } from '@/config';
import { TEAM_NAME } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn, getDateByTimestamp } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
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
  recordingLink: z.string(),
  id: z.string().optional(),
});

export type Matches = z.infer<typeof formSchema>;
type FormValues = Omit<Matches, 'id'>;

type Props = Partial<Matches> & { parentUrl: string; queryKey: string };

const MatchForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
  const navigate = useNavigate();

  const { data } = useData();
  const { halls, teams } = data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: props.dateTime ? getDateByTimestamp(props.dateTime) : undefined,
      hall: props.hall ?? '',
      opponent: props.opponent ?? '',
      host: props.host ?? false,
      gamesHost: props.gamesHost ?? '',
      gamesGuest: props.gamesGuest ?? '',
      recordingLink: props.recordingLink ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (id) {
        const docRef = doc(db, queryKey, id);
        await updateDoc(docRef, data);
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
        <DateTimePicker<FormValues> formControl={form.control} name="dateTime" />

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
                  {halls.map((hall) => {
                    return (
                      <SelectItem key={hall.id} value={hall.id!}>
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
                  {teams.map((team) => {
                    return (
                      <SelectItem key={team.id} value={team.id!}>
                        {team.name}
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
                <FormLabel>{TEAM_NAME} домакин</FormLabel>
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
          name="recordingLink"
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
