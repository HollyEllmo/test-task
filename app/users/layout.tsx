interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const UsersLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400 to-green-400 sm:h-full">
      {children}
    </div>
  );
};

export default UsersLayout;
