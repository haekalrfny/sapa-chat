import React, { useState } from "react";
// icons
import {
  FiEdit,
  FiLogOut,
  FiMoon,
  FiMoreHorizontal,
  FiSun,
  FiUser,
} from "react-icons/fi";
import Dropdown from "../Dropdown";
import { useStateContext } from "../../context/StateContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useNotification } from "../../context/NotificationContext";
import { useModalContext } from "../../context/ModalContext";

export default function TopSidebar() {
  const { setLoadingButton } = useStateContext();
  const { currentUser, fetchUserInfo } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { notifyError, notifySuccess } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const { setShowLogout, setShowAddUser, setShowProfile } = useModalContext();

  const handleDarkMode = async () => {
    setLoadingButton(true);
    try {
      const newDarkModeValue = !currentUser.darkmode;
      await updateDoc(doc(db, "users", currentUser.id), {
        darkmode: newDarkModeValue,
      });
      await fetchUserInfo(currentUser.id);
      notifySuccess("Dark mode toggled successfully");
    } catch (error) {
      notifyError(error.message);
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  const items = [
    {
      icon: FiUser,
      text: "Profile",
      onClick: () => setShowProfile(true),
    },
    {
      icon: darkmode ? FiSun : FiMoon,
      text: darkmode ? "Light Mode" : "Dark Mode",
      onClick: handleDarkMode,
    },
    {
      icon: FiLogOut,
      text: "Logout",
      onClick: () => setShowLogout(true),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center pt-6">
        <button
          className={`font-semibold ${
            darkmode ? "text-white" : "text-[#697565]"
          } ml-1 text-lg`}
          onClick={() => window.location.reload()}
        >
          Sapa
        </button>
        <div
          className={`flex items-center gap-3 text-xl ${
            darkmode ? "text-white" : "text-gray-900"
          } `}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative ${
              darkmode ? "hover:bg-[#121212]" : "hover:bg-slate-100 "
            } p-1 rounded-md`}
          >
            <FiMoreHorizontal />
            {isOpen && (
              <Dropdown items={items} onCancel={() => setIsOpen(false)} />
            )}
          </button>

          <button
            onClick={() => setShowAddUser(true)}
            className={` bg-[#697565] hover:bg-[#474f44] py-1.5 px-2 font-medium text-xs rounded-md text-white`}
          >
            Discover Friends
          </button>
        </div>
      </div>
    </>
  );
}
