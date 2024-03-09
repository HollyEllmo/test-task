"use client";
import { FileResponseProvider } from "@/components/FileContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const CreateNewsLayout = ({ children }: ProtectedLayoutProps) => {
  return <FileResponseProvider>{children}</FileResponseProvider>;
};

export default CreateNewsLayout;
