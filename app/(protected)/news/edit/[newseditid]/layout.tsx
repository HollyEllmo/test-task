"use client";
import { FileResponseProvider } from "@/components/FileContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const CreateNewsLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="sm:h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400 to-green-400">
      <FileResponseProvider>{children}</FileResponseProvider>
    </div>
  );
};

export default CreateNewsLayout;
