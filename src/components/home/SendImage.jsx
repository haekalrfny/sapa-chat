import React, { useEffect, useRef, useState } from "react";
import UploadAvatar from "../auth/UploadAvatar";
import { FiX } from "react-icons/fi";
import Button from "../Button";
import { useUserStore } from "../../lib/userStore";

export default function SendImage({ onCancel, setValue, onClick }) {
  const [isExiting, setIsExiting] = useState(false);
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
    setValue({
      file: null,
      url: "",
    });
    setTimeout(() => {
      onCancel();
    }, 200);
  }

  function handleSubmit() {
    setIsExiting(true);
    onClick();
    setTimeout(() => {
      onCancel();
    }, 200);
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${
        darkmode ? "bg-white bg-opacity-10" : "bg-black bg-opacity-50"
      } flex justify-center items-center`}
    >
      <div
        ref={modalRef}
        className={`${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        }  p-6 rounded-lg space-y-3 shadow-lg w-full max-w-sm ${
          isExiting ? "animate-slidefromTop" : "animate-slideFromBottom"
        }`}
      >
        <div className="flex w-full justify-between items-center">
          <h2
            className={`text-lg font-semibold ${
              darkmode ? "text-white" : "text-gray-900"
            } `}
          >
            Upload Picture
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
          Got a cool pic? Go ahead and drop it here!
        </p>
        <UploadAvatar setValue={setValue} />
        <Button onClick={handleSubmit} text="Send" />
      </div>
    </div>
  );
}
