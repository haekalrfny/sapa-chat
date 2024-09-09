import React from "react";
// images
import ImageChat from "../../../public/image/manage_chat.svg";
import ImageChatDark from "../../../public/image/manage_chat_dark.svg";
import { useUserStore } from "../../lib/userStore";

export default function None() {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  return (
    <div
      className={`w-full h-screen flex items-center justify-center ${
        darkmode ? "bg-[#121212] text-white" : "bg-slate-100"
      }`}
    >
      <div
        className={`flex flex-col justify-center items-center gap-6 ${
          darkmode ? "text-white" : "text-gray-600  "
        } `}
      >
        <img
          src={darkmode ? ImageChatDark : ImageChat}
          alt="chat"
          className="w-52 md:w-40"
        />
        <div className="text-center mx-6">
          <h1 className="text-xl font-semibold">No Chats Yet!</h1>
          <p className="text-sm">
            Go ahead, pick someone to{" "}
            <span className="text-[#697565] font-semibold underline">Sapa</span>{" "}
            and start the convo!
          </p>
        </div>
      </div>
    </div>
  );
}
