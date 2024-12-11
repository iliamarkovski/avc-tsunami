import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DialogDescription,
} from '@/components';
import { cn } from '@/lib';
import { EventOptions } from '@/types';
import { Info } from 'lucide-react';

type Props = {
  onChange: (value: string) => Promise<void>;
  selectedValue: EventOptions | '';
  data: Record<EventOptions, { name: string; role: string }[]>;
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
];

const EventResponse = ({ onChange, selectedValue, data }: Props) => {
  return (
    <div className="!mt-4 flex flex-col items-center gap-4">
      <Select onValueChange={onChange} value={selectedValue}>
        <SelectTrigger
          id="selectedName"
          className={cn('w-max gap-2', {
            'text-green-600': selectedValue === 'yes',
            'text-red-600': selectedValue === 'no',
          })}>
          {selectedValue ? 'Ще присъствам:' : null} <SelectValue placeholder="Потвърди присъствие" />
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
        <Badge variant="positive">ДА: {data?.yes.length}</Badge>
        <Badge variant="negative">НЕ: {data?.no.length}</Badge>
        <Dialog>
          <DialogTrigger>
            <Info className="text-blue-600" />
          </DialogTrigger>
          <DialogContent className="p-4 md:p-6">
            <DialogTitle>Гласували</DialogTitle>
            <DialogHeader>
              <Tabs defaultValue={OPTIONS[0].value}>
                <TabsList className="flex w-full">
                  {OPTIONS.map((tab) => {
                    return (
                      <TabsTrigger key={`trigger-${tab.value}`} value={tab.value} className="flex-1">
                        {tab.label} ({data[tab.value].length})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {OPTIONS.map((tab) => {
                  return (
                    <TabsContent key={`content-${tab.value}`} value={tab.value} className="mt-3 space-y-1">
                      {data[tab.value]?.map((item, index) => {
                        return (
                          <DialogDescription key={`${item.name}-${index}`}>
                            {item.name} ({item.role.toLowerCase()})
                          </DialogDescription>
                        );
                      })}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export { EventResponse };
