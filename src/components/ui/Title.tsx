type Props = {
  title: string;
};

const Title = ({ title }: Props) => {
  return <h2 className="mt-10 scroll-m-20 text-lg font-semibold first:mt-0 sm:text-xl">{title}</h2>;
};

export { Title };
