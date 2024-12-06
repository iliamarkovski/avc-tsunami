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
  data: { yes: string[]; no: string[]; maybe: string[] };
};

const TABS: {
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

const EventResponse = ({ onChange, selectedValue, data }: Props) => {
  return (
    <div className="!mt-4 flex flex-col items-center gap-4">
      <Select onValueChange={onChange} value={selectedValue}>
        <SelectTrigger
          id="selectedName"
          className={cn('w-max gap-2', {
            'text-green-600': selectedValue === 'yes',
            'text-red-600': selectedValue === 'no',
            'text-yellow-600': selectedValue === 'maybe',
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
        <Badge variant="neutral">МОЖЕ БИ: {data?.maybe.length}</Badge>
        <Dialog>
          <DialogTrigger>
            <Info className="text-blue-600" />
          </DialogTrigger>
          <DialogContent className="p-4 md:p-6">
            <DialogTitle>Гласували</DialogTitle>
            <DialogHeader>
              <Tabs defaultValue={TABS[0].value}>
                <TabsList className="flex w-full">
                  {TABS.map((tab) => {
                    return (
                      <TabsTrigger key={`trigger-${tab.value}`} value={tab.value} className="flex-1">
                        {tab.label} ({data[tab.value].length})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {TABS.map((tab) => {
                  return (
                    <TabsContent key={`content-${tab.value}`} value={tab.value} className="mt-3 space-y-1">
                      {data[tab.value]?.map((name) => {
                        return (
                          <DialogDescription className="text-center" key={name}>
                            {name}
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
