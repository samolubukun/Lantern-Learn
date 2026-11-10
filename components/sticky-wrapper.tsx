type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({ children }: Props) => {
  return (
    <aside className="hidden xl:block w-[320px] 2xl:w-[350px] shrink-0 sticky self-start top-24">
      <div className="flex flex-col gap-y-4">
        {children}
      </div>
    </aside>
  );
};