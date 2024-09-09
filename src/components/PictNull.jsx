import React from "react";
import { RiUser4Line } from "react-icons/ri";
import { useUserStore } from "../lib/userStore";

export default function PictNull({ size, iconsize }) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;

  return (
    <div
      className={` w-${size} h-${size} rounded-full  ${
        darkmode ? "bg-[#121212] text-gray-400 border-gray-800" : "bg-slate-200 text-[#697565] "
      }  flex items-center justify-center font-bold border`}
    >
      <RiUser4Line className={`text-${iconsize}`} />
    </div>
  );
}
