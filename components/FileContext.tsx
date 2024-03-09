import React, { createContext, useState, useContext, ReactNode } from "react";

interface FileResponseContextType {
  fileResponse: any;
  updateFileResponse: (response: any) => void;
}

interface Props {
  children: ReactNode;
}

const FileResponseContext = createContext<FileResponseContextType>({
  fileResponse: null,
  updateFileResponse: () => {},
});

export const FileResponseProvider = ({ children }: Props) => {
  const [fileResponse, setFileResponse] = useState<any>(null);

  const updateFileResponse = (response: any) => {
    setFileResponse(response);
  };

  return (
    <FileResponseContext.Provider value={{ fileResponse, updateFileResponse }}>
      {children}
    </FileResponseContext.Provider>
  );
};

export const useFileResponse = () => useContext(FileResponseContext);
