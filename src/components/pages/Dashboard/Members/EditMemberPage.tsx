import { MemberForm, FormCard } from '@/components';
import { useData } from '@/contexts';
import { getDataById } from '@/lib';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: string;
  title: string;
  description: string;
  parentUrl: string;
};

const EditMemberPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const { members } = data;

  const member = getDataById(members, id);

  if (!member) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <MemberForm {...member} id={id} parentUrl={parentUrl} queryKey={queryKey} />
    </FormCard>
  );
};

export { EditMemberPage };
