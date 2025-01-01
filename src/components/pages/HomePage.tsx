import { Tabs, TabsContent, TabsList, TabsTrigger, EventsMatchesList } from '@/components';
import { EventsTrainingsList } from '@/components/ui/EventsTrainingsList';
import { QUERY_KEYS } from '@/constants';
import { useAuth } from '@/contexts';
import { QueryKeys } from '@/types';

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

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Tabs defaultValue={tabs[0].value} key={user?.uid}>
      <TabsList className="flex w-full">
        {tabs.map((tab) => {
          if (!user && tab.value === QUERY_KEYS.TRAINING) {
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
        if (!user && tab.value === QUERY_KEYS.TRAINING) {
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

export { HomePage };
