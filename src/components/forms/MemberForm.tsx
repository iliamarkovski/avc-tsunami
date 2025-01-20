import { addDocument, updateDocument } from '@/api';
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { toast } from '@/hooks';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  names: z.string().min(1, { message: 'Задължително поле' }),
  role: z.string().min(1, { message: 'Задължително поле' }),
  number: z.string().min(1, { message: 'Задължително поле' }),
  active: z.boolean().default(false).optional(),
  captain: z.boolean().default(false).optional(),
  id: z.string().optional(),
});

export type Members = z.infer<typeof formSchema>;
type FormValues = Omit<Members, 'id'>;

type Props = Partial<Members> & { id?: string; parentUrl: string; queryKey: string };

const MemberForm = ({ id, parentUrl, queryKey, ...props }: Props) => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: props.names ?? '',
      role: props.role ?? '',
      number: props.number ?? '',
      active: props.active ?? false,
      captain: props.captain ?? false,
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
    mutate(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имена</FormLabel>
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

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <Label className="flex cursor-pointer flex-row items-center gap-2 rounded-md border p-4">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Картотекиран
            </Label>
          )}
        />

        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <Label className="flex cursor-pointer flex-row items-center gap-2 rounded-md border p-4">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Капитан
            </Label>
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

export { MemberForm };
