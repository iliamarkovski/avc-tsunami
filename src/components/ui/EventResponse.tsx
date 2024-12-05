import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/components';
import { cn } from '@/lib';
import { EventOptions } from '@/types';

type Props = {
  eventId: string;
  onChange: (value: string) => Promise<void>;
  value: EventOptions | '';
  counter: {
    yes: number;
    no: number;
    maybe: number;
  };
};

const OPTIONS: {
  label: string;
  value: EventOptions;
}[] = [
  {
    label: 'ДА',
    value: 'yes',
  },
  {
    label: 'НЕ',
    value: 'no',
  },
  {
    label: 'МОЖЕ БИ',
    value: 'maybe',
  },
];

const EventResponse = ({ onChange, value, counter }: Props) => {
  return (
    <div className="!mt-4 flex flex-col items-center gap-4">
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          id="selectedName"
          className={cn('w-max gap-2', {
            'text-green-600': value === 'yes',
            'text-red-600': value === 'no',
            'text-yellow-600': value === 'maybe',
          })}>
          {value ? 'Ще присъствам:' : null} <SelectValue placeholder="Потвърди присъствие" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Badge variant="positive">ДА: {counter?.yes}</Badge>
        <Badge variant="negative">НЕ: {counter?.no}</Badge>
        <Badge variant="neutral">МОЖЕ БИ: {counter?.maybe}</Badge>
      </div>
    </div>
  );
};

export { EventResponse };
