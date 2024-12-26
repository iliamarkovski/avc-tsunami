import {
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { cn } from '@/lib';
import { format } from 'date-fns';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  formControl: Control<T>;
  name: Path<T>;
};

const INITIAL_TIME = '00:00';

const DateTimePicker = <T extends FieldValues>({ formControl, name }: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => {
        const defaultTime = field.value ? format(new Date(field.value), 'HH:mm') : INITIAL_TIME;

        return (
          <FormItem className="w-full">
            <FormLabel>Дата и час</FormLabel>
            <div className="flex gap-1">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-full justify-start px-3 font-normal', !field.value && 'text-muted-foreground')}>
                      {field.value ? `${format(field.value, 'dd.MM.yyyy')}` : <span>Изберете първо дата</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(selectedDate) => {
                      const time = field.value ? format(new Date(field.value), 'HH:mm') : INITIAL_TIME;
                      const [hours, minutes] = time?.split(':');
                      selectedDate?.setHours(parseInt(hours), parseInt(minutes));
                      setIsOpen(false);
                      field.onChange(selectedDate);
                    }}
                    defaultMonth={field.value}
                  />
                </PopoverContent>
              </Popover>

              <Select
                disabled={!field.value}
                defaultValue={defaultTime}
                onValueChange={(e) => {
                  const date = field.value;
                  const [hours, minutes] = e.split(':');
                  const newDate = new Date(date!.getTime());
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  field.onChange(newDate);
                }}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Изберете час" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 96 }).map((_, i) => {
                    const hour = Math.floor(i / 4)
                      .toString()
                      .padStart(2, '0');
                    const minute = ((i % 4) * 15).toString().padStart(2, '0');
                    return (
                      <SelectItem key={i} value={`${hour}:${minute}`}>
                        {hour}:{minute}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { DateTimePicker };
