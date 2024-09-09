import React, { useEffect, useRef, useState } from "react";
// components
import Sidebar from "../../components/home/Sidebar";
import Chats from "../../components/home/Chats";
import None from "./None";
// store
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { FiSidebar } from "react-icons/fi";
import { useStateContext } from "../../context/StateContext";
import { useModalContext } from "../../context/ModalContext";
import Logout from "../../components/auth/Logout";
import AddUser from "../../components/home/AddUser";
import Profile from "../../components/auth/Profile";
import Details from "../../components/home/Details";

export default function Home() {
  const { chatId } = useChatStore();
  const [isExiting, setIsExiting] = useState(false);
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { isSidebarOpen, setIsSidebarOpen } = useStateContext();
  const {
    showLogout,
    setShowLogout,
    showAddUser,
    setShowAddUser,
    showProfile,
    setShowProfile,
    showDetails,
    setShowDetails,
  } = useModalContext();
  const modalRef = useRef(null);
  const startXRef = useRef(null);

  useEffect(() => {
    if (!showDetails) {
      function handleTouchStart(event) {
        startXRef.current = event.touches[0].clientX;
      }

      function handleTouchMove(event) {
        if (!startXRef.current) return;

        const currentX = event.touches[0].clientX;
        const diffX = currentX - startXRef.current;

        // Swipe to the right
        if (diffX > 50) {
          setIsSidebarOpen(true);
          startXRef.current = null;
        }

        // Swipe to the left
        if (diffX < -50) {
          setIsSidebarOpen(false);
          startXRef.current = null;
        }
      }

      function handleClickOutside(event) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          handleClose();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [showDetails]);

  function handleClose() {
    setIsExiting(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsExiting(false);
    }, 100);
  }

  return (
    <>
      <div
        className={`flex relative ${
          darkmode ? "bg-[#121212]" : "bg-slate-100"
        }`}
      >
        {!isSidebarOpen && (
          <button
            className={`absolute md:hidden p-2 m-2 rounded-md z-50 ${
              darkmode
                ? "hover:bg-[#0b0b0b] text-white"
                : "hover:bg-slate-100 text-gray-900"
            }`}
          >
            <FiSidebar className="text-3xl" />
          </button>
        )}
        <div
          ref={modalRef}
          className={`fixed top-0 inset-0 left-0 md:w-80 h-screen bg-gray-800 text-white md:relative  transition-transform duration-300 z-40 md:z-0 ${
            isExiting
              ? "animate-slideOutLeft md:animate-none"
              : "animate-slideInLeft md:animate-none"
          } ${isSidebarOpen ? "block" : "hidden"} md:block`}
        >
          <Sidebar />
        </div>

        <div className="flex-1 relative z-10">
          {chatId ? <Chats /> : <None />}
        </div>
      </div>
      {showLogout && <Logout onCancel={() => setShowLogout(false)} />}
      {showAddUser && <AddUser onCancel={() => setShowAddUser(false)} />}
      {showProfile && <Profile onCancel={() => setShowProfile(false)} />}
      {showDetails && <Details onCancel={() => setShowDetails(false)} />}
    </>
  );
}
