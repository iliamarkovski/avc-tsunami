import { updateDocument } from '@/api';
import {
  Avatar,
  AvatarImage,
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
} from '@/components';
import { OTHER_VALUE, QUERY_KEYS } from '@/constants';
import { useData } from '@/contexts';
import { toast } from '@/hooks';
import { cn, getRoleLabel } from '@/lib';
import { Roles } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const storage = getStorage();

const formNames = z.object({
  names: z.string().optional(),
  role: z.string().optional(),
  number: z.string().optional(),
  active: z.boolean().default(false).optional(),
  captain: z.boolean().default(false).optional(),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});

type User = z.infer<typeof formNames>;

const ProfileForm = () => {
  const navigate = useNavigate();
  const { data } = useData();
  const { members, loggedInUser } = data;
  const [isLoading, setIsLoading] = useState(false);

  const memberUser = members.find((member) => member.id === loggedInUser?.memberId);

  const [imageUrl, setImageUrl] = useState<string | null | undefined>(loggedInUser?.image);
  const isOtherMember = loggedInUser?.memberId === OTHER_VALUE;

  const form = useForm<User>({
    resolver: zodResolver(formNames),
    defaultValues: {
      names: isOtherMember ? loggedInUser.names : memberUser?.names,
      role: isOtherMember ? getRoleLabel(loggedInUser.role) : getRoleLabel(memberUser?.role as Roles),
      imageUrl: loggedInUser?.image || '',
      active: isOtherMember ? false : memberUser?.active,
      captain: isOtherMember ? false : memberUser?.captain,
      number: isOtherMember ? '' : memberUser?.number && +memberUser.number < 0 ? '' : memberUser?.number,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: User) => {
      await updateDocument(QUERY_KEYS.MEMBERS, loggedInUser?.memberId!, { image: data.imageUrl || null });
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

  const handleSubmit = async (value: User) => {
    setIsLoading(true);
    const { imageFile, imageUrl, ...otherValues } = value;

    try {
      let newImageUrl: string | undefined = undefined;

      if (imageFile && imageFile instanceof File) {
        // Upload the new file to Firebase Storage
        const storageRef = ref(storage, `profileImages/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);

        // Get the file's download URL
        newImageUrl = await getDownloadURL(snapshot.ref);
      } else if (!imageFile && imageUrl) {
        // Delete the existing file from Firebase Storage
        const fileRef = ref(storage, imageUrl);
        await deleteObject(fileRef);
      }

      // Save the form data with the updated file URL (or empty URL)
      await mutate({ ...otherValues, imageUrl: newImageUrl || '' });
    } catch (error) {
      console.error('Error uploading file or saving data:', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setImageUrl(undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Снимка</FormLabel>

              {imageUrl ? (
                <div className="flex items-center gap-2">
                  <Avatar className="aspect-square h-auto w-36 rounded-md border sm:w-40">
                    <AvatarImage src={imageUrl} className="object-cover" />
                  </Avatar>
                  <Button size="icon" variant="ghost" title="Изтрий" onClick={handleDelete}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              ) : (
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file ?? undefined);
                    }}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              )}
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
            <Label className="flex cursor-not-allowed flex-row items-center gap-2 rounded-md border p-4">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              Картотекиран
            </Label>
          )}
        />

        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <Label className="flex cursor-not-allowed flex-row items-center gap-2 rounded-md border p-4">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled />
              Капитан
            </Label>
          )}
        />

        <div className="!mt-8 flex gap-4">
          <Link to="/" className={cn(buttonVariants({ variant: 'outline' }))}>
            Отказ
          </Link>

          <Button type="submit" disabled={isLoading || isPending} className="w-full">
            {isLoading || isPending ? <Loader2 className="animate-spin" /> : null}
            Запази
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ProfileForm };
