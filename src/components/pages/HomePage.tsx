import { Tabs, TabsContent, TabsList, TabsTrigger, EventsMatchesList } from '@/components';
import { EventsTrainingsList } from '@/components/ui/EventsTrainingsList';
import { IVL_KEY, TRAINING_KEY, VM_KEY } from '@/constants';
import { useAuth } from '@/contexts';

type Tabs = {
  title: string;
  value: string;
}[];

const tabs: Tabs = [
  {
    title: 'Volley Mania',
    value: VM_KEY,
  },
  {
    title: 'IVL',
    value: IVL_KEY,
  },
  {
    title: 'Тренировка',
    value: TRAINING_KEY,
  },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Tabs defaultValue={tabs[0].value} key={user?.uid}>
      <TabsList className="flex w-full">
        {tabs.map((tab) => {
          if (!user && tab.value === TRAINING_KEY) {
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
        if (!user && tab.value === TRAINING_KEY) {
          return;
        }

        return (
          <TabsContent key={`content-${tab.value}`} value={tab.value}>
            {tab.value === TRAINING_KEY ? <EventsTrainingsList /> : <EventsMatchesList queryKey={tab.value} />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export { HomePage };
