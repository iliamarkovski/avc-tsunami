import {
  EventsTabs,
  FutureEventsList,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { useAuth } from '@/contexts';
import { ReactNode, useState } from 'react';

type Views = 'list' | 'tabs';

const VALUES = {
  TABS: 'tabs',
  LIST: 'list',
} as const;

const OPTIONS: { label: string; value: Views }[] = [
  { label: 'Списък', value: VALUES.LIST },
  { label: 'Табове', value: VALUES.TABS },
];

const ViewComponent: Record<Views, ReactNode> = {
  list: <FutureEventsList />,
  tabs: <EventsTabs />,
};

const HomePage = () => {
  const { user } = useAuth();
  const [value, setValue] = useState<Views>(!!user ? VALUES.LIST : VALUES.TABS);

  const handleChange = (view: Views) => {
    setValue(view);
  };

  return (
    <div className="grid gap-4">
      {!!user ? (
        <Select value={value} onValueChange={(view) => handleChange(view as Views)}>
          <SelectTrigger className="w-[180px]">
            Изглед: <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {ViewComponent[value]}
    </div>
  );
};

export { HomePage };
