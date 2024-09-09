import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        loadingButton,
        setLoadingButton,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
