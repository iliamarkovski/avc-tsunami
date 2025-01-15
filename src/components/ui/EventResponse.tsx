import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Separator,
} from '@/components';
import { cn, getRoleLabel } from '@/lib';
import { EventOptions } from '@/types';
import { Info } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useMemo } from 'react';

type Props = {
  onChange: (value: string) => void;
  selectedValue: EventOptions | undefined;
  data: Record<EventOptions, { names: string; role: string; id: string; isMember: boolean }[]>;
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

// const votedYesTotalLabel =

const EventResponse = ({ onChange, selectedValue, data }: Props) => {
  const votedCoachesWithYes = useMemo(() => {
    return data?.yes?.filter((item) => item.role === getRoleLabel('coach'));
  }, [data]);

  const votedCoachesWithNo = useMemo(() => {
    return data?.no?.filter((item) => item.role === getRoleLabel('coach'));
  }, [data]);

  const lenghtVotedYesLabel = `${data.yes.length - votedCoachesWithYes.length}${votedCoachesWithYes.length > 0 ? ' + Т' : ''}`;
  const lenghtVotedNoLabel = `${data.no.length - votedCoachesWithNo.length}${votedCoachesWithNo.length > 0 ? ' + Т' : ''}`;
  return (
    <div className="!mt-4 flex flex-col items-center gap-4">
      <Select onValueChange={onChange} value={selectedValue}>
        <SelectTrigger
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

      <div className="flex h-5 items-center space-x-4 text-sm">
        <span className="flex items-center gap-1 text-green-600">ДА : {lenghtVotedYesLabel}</span>
        <Separator orientation="vertical" />
        <span className="flex items-center gap-1 text-red-600">НЕ : {lenghtVotedNoLabel}</span>
        <Separator orientation="vertical" />
        <Dialog>
          <DialogTrigger>
            <Info className="text-blue-600" />
          </DialogTrigger>
          <DialogContent className="p-4 md:p-6">
            <VisuallyHidden.Root>
              <DialogDescription>Гласували</DialogDescription>
            </VisuallyHidden.Root>
            <DialogTitle>Гласували</DialogTitle>
            <DialogHeader>
              <Tabs defaultValue={OPTIONS[0].value}>
                <TabsList className="flex w-full">
                  {OPTIONS.map((tab) => {
                    const votedCoaches = useMemo(() => {
                      return data[tab.value]?.filter((item) => item.role === getRoleLabel('coach'));
                    }, [tab]);

                    const lengthLabel = `${data[tab.value].length - votedCoaches.length}${votedCoaches.length > 0 ? ' + Т' : ''}`;

                    return (
                      <TabsTrigger key={`trigger-${tab.value}`} value={tab.value} className="flex-1">
                        {tab.label} ({lengthLabel})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {OPTIONS.map((tab) => {
                  const votedCoaches = useMemo(() => {
                    return data[tab.value]?.filter((item) => item.role === getRoleLabel('coach'));
                  }, [data]);

                  const votedMembers = useMemo(() => {
                    return data[tab.value]?.filter((item) => item.isMember && item.role !== getRoleLabel('coach'));
                  }, [data]);

                  const votedOthers = useMemo(() => {
                    return data[tab.value]?.filter((item) => !item.isMember);
                  }, [data]);

                  return (
                    <TabsContent key={`content-${tab.value}`} value={tab.value} className="mt-3 space-y-1">
                      {votedCoaches?.map((item) => {
                        return (
                          <DialogDescription key={item.id}>
                            {item.names} ({item.role.toLowerCase()})
                          </DialogDescription>
                        );
                      })}

                      {votedCoaches.length > 0 && votedMembers.length > 0 ? <Separator className="!my-2" /> : null}

                      {votedMembers?.map((item) => {
                        return (
                          <DialogDescription key={item.id}>
                            {item.names} ({item.role.toLowerCase()})
                          </DialogDescription>
                        );
                      })}

                      {(votedMembers.length > 0 || votedCoaches.length > 0) && votedOthers.length > 0 ? (
                        <Separator className="!my-2" />
                      ) : null}

                      {votedOthers?.map((item) => {
                        return (
                          <DialogDescription key={item.id}>
                            {item.names} ({item.role.toLowerCase()})
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
