import { Tabs, TabsContent, TabsList, TabsTrigger, EventsList } from '@/components';
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
];

const HomePage = () => {
  return (
    <Tabs defaultValue={tabs[0].value}>
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => {
          return (
            <TabsTrigger key={`trigger-${tab.value}`} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => {
        return (
          <TabsContent key={`content-${tab.value}`} value={tab.value}>
            <EventsList type={tab.value} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export { HomePage };
