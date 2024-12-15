import { Tabs, TabsContent, TabsList, TabsTrigger, EventsMatchesList } from '@/components';
import { EventsTrainingsList } from '@/components/ui/EventsTrainingsList';
import { useAuth } from '@/contexts';
import { EventType } from '@/types';

type Tabs = {
  title: string;
  value: EventType;
}[];

const tabs: Tabs = [
  {
    title: 'Volley Mania',
    value: 'volleyMania',
  },
  {
    title: 'IVL',
    value: 'ivl',
  },
  {
    title: 'Тренировка',
    value: 'training',
  },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Tabs defaultValue={tabs[0].value} key={user?.uid}>
      <TabsList className="flex w-full">
        {tabs.map((tab) => {
          if (!user && tab.value === 'training') {
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
        if (!user && tab.value === 'training') {
          return;
        }

        return (
          <TabsContent key={`content-${tab.value}`} value={tab.value}>
            {tab.value === 'training' ? <EventsTrainingsList /> : <EventsMatchesList type={tab.value} />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export { HomePage };
