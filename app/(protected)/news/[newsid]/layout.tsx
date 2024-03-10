interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const NewsLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="sm:h-full w-full flex flex-col gap-y-10 items-center justify-center">
      {children}
    </div>
  );
};

export default NewsLayout;
