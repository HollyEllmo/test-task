interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const EditUserLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="sm:h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400 to-green-400">
      {children}
    </div>
  );
};

export default EditUserLayout;
