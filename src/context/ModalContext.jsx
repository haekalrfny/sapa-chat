import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const ModalContext = ({ children }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Context.Provider
      value={{
        showLogout,
        setShowLogout,
        showAddUser,
        setShowAddUser,
        showProfile,
        setShowProfile,
        showDetails,
        setShowDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useModalContext = () => useContext(Context);
