import { EventsMatchesList, EventsTrainingsList, TabsContent, TabsList, TabsTrigger } from '@/components';
import { LOCAL_STORAGE_TAB, QUERY_KEYS } from '@/constants';
import { useData } from '@/contexts';
import { QueryKeys } from '@/types';
import { Tabs } from '@radix-ui/react-tabs';

type Tabs = {
  title: string;
  value: QueryKeys;
}[];

const tabs: Tabs = [
  {
    title: 'Volley Mania',
    value: QUERY_KEYS.VOLLEYMANIA,
  },
  {
    title: 'IVL',
    value: QUERY_KEYS.IVL,
  },
  {
    title: 'Тренировка',
    value: QUERY_KEYS.TRAINING,
  },
];

const EventsTabs = () => {
  const { data } = useData();
  const { loggedInUser } = data;

  const savedTab = localStorage.getItem(LOCAL_STORAGE_TAB) as QueryKeys | null;

  const handleTabChange = (value: QueryKeys) => {
    localStorage.setItem(LOCAL_STORAGE_TAB, value);
  };

  return (
    <Tabs defaultValue={savedTab || tabs[0].value} onValueChange={(e) => handleTabChange(e as QueryKeys)}>
      <TabsList className="flex w-full">
        {tabs.map((tab) => {
          if (!loggedInUser && tab.value === QUERY_KEYS.TRAINING) {
            return;
          }

          return (
            <TabsTrigger key={`trigger-${tab.value}`} value={tab.value} className="flex-1">
              {tab.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => {
        if (!loggedInUser && tab.value === QUERY_KEYS.TRAINING) {
          return;
        }

        return (
          <TabsContent key={`content-${tab.value}`} value={tab.value}>
            {tab.value === QUERY_KEYS.TRAINING ? <EventsTrainingsList /> : <EventsMatchesList queryKey={tab.value} />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export { EventsTabs };
