import React, { useState } from "react";
// icons
import { FiInfo } from "react-icons/fi";
// store
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import PictNull from "../PictNull";
import { useModalContext } from "../../context/ModalContext";

export default function Headers() {
  const { setShowDetails } = useModalContext();
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { isReceiverBlocked, isCurrentUserBlocked, user } = useChatStore();

  return (
    <>
      <div className={`h-full  ${darkmode ? "bg-[#0b0b0b] " : "bg-white"} `}>
        <div className="w-full flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3 ml-10 md:ml-0">
            {user?.avatar && !isCurrentUserBlocked && !isReceiverBlocked ? (
              <img
                src={user?.avatar}
                alt=""
                className="w-9 h-9 rounded-full border"
              />
            ) : (
              <PictNull size={9} />
            )}

            <div>
              <div className="flex items-center gap-1">
                <h1
                  className={`text-sm font-medium ${
                    darkmode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.name}
                </h1>
                {isReceiverBlocked || isCurrentUserBlocked ? (
                  <p className="text-[10px] text-red-500 bg-red-100 py-0.5 px-1.5 rounded-md">
                    blocked
                  </p>
                ) : null}
              </div>
              <p
                className={`text-xs ${
                  darkmode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {isCurrentUserBlocked || isReceiverBlocked
                  ? "unknown"
                  : `@${user?.username}`}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 text-xl ${
              darkmode ? "text-white" : "text-gray-900"
            }`}
          >
            <button
              onClick={() => setShowDetails(true)}
              className={`p-1 rounded-md ${
                darkmode ? "hover:bg-[#121212]" : "hover:bg-slate-100"
              }`}
            >
              <FiInfo />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
