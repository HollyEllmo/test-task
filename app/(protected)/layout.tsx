interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="sm:h-full w-full flex flex-col gap-y-10 ">{children}</div>
  );
};

export default ProtectedLayout;
