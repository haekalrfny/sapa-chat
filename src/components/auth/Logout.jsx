import React, { useEffect, useRef, useState } from "react";
// firebase
import { auth } from "../../lib/firebase";
// context
import { useNotification } from "../../context/NotificationContext";
import { useStateContext } from "../../context/StateContext";
// components
import Button from "../Button";
import { FiX } from "react-icons/fi";
import { useUserStore } from "../../lib/userStore";

export default function Logout({ onCancel }) {
  const [isExiting, setIsExiting] = useState(false);
  const { notifySuccess } = useNotification();
  const { setLoadingButton } = useStateContext();
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClose() {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  }

  const handleLogout = async () => {
    setLoadingButton(true);
    try {
      await auth.signOut();
      setLoadingButton(false);
      notifySuccess("Logout successful");
    } catch (error) {
      setLoadingButton(false);
      console.log(error);
      notifyError(error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        darkmode ? "bg-white bg-opacity-10" : "bg-black bg-opacity-50 "
      } flex justify-center items-center`}
    >
      <div
        ref={modalRef}
        className={`${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        }  p-6 rounded-lg shadow-lg w-full max-w-sm ${
          isExiting ? "animate-slidefromTop" : "animate-slideFromBottom"
        }`}
      >
        <div className="flex w-full justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold ${
              darkmode ? "text-white" : "text-gray-900"
            } `}
          >
            Logout
          </h2>
          <button
            onClick={handleClose}
            className={`p-1 rounded-md ${
              darkmode ? "hover:bg-[#121212] text-white" : "hover:bg-slate-100"
            }`}
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <p
          className={`${
            darkmode ? "text-gray-300" : "text-gray-600"
          } text-sm mb-3`}
        >
          Are you sure you want to logout? This action will end your current
          session.
        </p>
        <div className="flex gap-2">
          <Button text="Yeah, Sure" onClick={handleLogout} />
          <Button
            text="Oops, Never Mind"
            onClick={handleClose}
            isCancel={true}
          />
        </div>
      </div>
    </div>
  );
}
