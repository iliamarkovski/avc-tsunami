import { MemberForm, FormCard } from '@/components';

type Props = {
  title: string;
  description: string;
  parentUrl: string;
  queryKey: string;
};

const AddMemberPage = ({ title, description, parentUrl, queryKey }: Props) => {
  return (
    <FormCard title={title} description={description}>
      <MemberForm parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { AddMemberPage };
