import { addDocument, updateDocument } from '@/api';
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
  Textarea,
  Label,
} from '@/components';
import { TEAM_NAME } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn, getDateByTimestamp } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

const formSchema = z.object({
  dateTime: z.date({
    required_error: 'Задължително поле',
  }),
  hall: z.string().min(1, { message: 'Задължително поле' }),
  opponent: z.string().min(1, { message: 'Задължително поле' }),
  host: z.boolean().default(false),
  gamesHost: z
    .string()
    .optional()
    .refine((value) => value === undefined || (Number(value) >= 0 && Number(value) <= 3), {
      message: 'Стойността трябва да е между 0 и 3',
    }),
  gamesGuest: z
    .string()
    .optional()
    .refine((value) => value === undefined || (Number(value) >= 0 && Number(value) <= 3), {
      message: 'Стойността трябва да е между 0 и 3',
    }),
  recordingLink: z.string(),
  id: z.string().optional(),
  statisticsDoc: z.instanceof(File).optional(),
  statisticsDocUrl: z.string().optional(),
  message: z.string().optional(),
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
      message: props.message ?? '',
      statisticsDocUrl: props.statisticsDocUrl,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (id) {
        await updateDocument(queryKey, id, data);
      } else {
        await addDocument(queryKey, data);
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
    const { statisticsDoc, ...otherValues } = value;

    try {
      let statisticsDocUrl: string | undefined = undefined;

      if (statisticsDoc && statisticsDoc instanceof File) {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `statistics/${Date.now()}-${statisticsDoc.name}`);
        const snapshot = await uploadBytes(storageRef, statisticsDoc);

        // Get the file's download URL
        statisticsDocUrl = await getDownloadURL(snapshot.ref);
      }

      // Save the form data with the file URL
      await mutate({ ...otherValues, statisticsDocUrl: statisticsDocUrl || '' });
    } catch (error) {
      console.error('Error uploading file or saving data:', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    }
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
            <Label className="flex cursor-pointer flex-row items-center gap-2 rounded-md border p-4">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              {TEAM_NAME} домакин
            </Label>
          )}
        />

        <FormField
          control={form.control}
          name="gamesHost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Геймове домакин</FormLabel>
              <FormControl>
                <Input {...field} type="number" pattern="[0-9]" inputMode="numeric" />
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
                <Input {...field} type="number" pattern="[0-9]" inputMode="numeric" />
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

        <FormField
          control={form.control}
          name="statisticsDoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статистика</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file ?? undefined);
                  }}
                  onBlur={field.onBlur}
                />
              </FormControl>

              {props.statisticsDocUrl && (
                <div className="mt-2">
                  <a href={props.statisticsDocUrl} target="_blank" rel="noopener noreferrer">
                    View Existing File
                  </a>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Съобщение</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
