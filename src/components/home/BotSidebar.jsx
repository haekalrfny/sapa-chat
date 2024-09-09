import React, { useState } from "react";
// icons
import { FiEdit } from "react-icons/fi";
// store
import { useUserStore } from "../../lib/userStore";
import PictNull from "../PictNull";
import Profile from "../auth/Profile";
import { useModalContext } from "../../context/ModalContext";

export default function BotSidebar() {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;

  const { setShowProfile } = useModalContext();

  return (
    <>
      <div className=" py-3 px-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-9 h-9 rounded-full border"
              />
            ) : (
              <PictNull size={9} />
            )}
            <div>
              <h1
                className={`font-medium text-sm ${
                  darkmode ? "text-white" : "text-gray-900"
                } `}
              >
                {currentUser.name}
              </h1>
              <p className="text-xs text-gray-400">@{currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className={`${
              darkmode
                ? "hover:bg-[#121212] text-white"
                : "hover:bg-slate-100 text-gray-900"
            } p-1 rounded-md`}
          >
            <FiEdit className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );
}
