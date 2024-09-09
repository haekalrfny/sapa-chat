import React from "react";
// context
import { useStateContext } from "../context/StateContext";
// components
import Loading from "./Loading";
import { useUserStore } from "../lib/userStore";

export default function Button({ text, onClick, isCancel }) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { loadingButton, loading } = useStateContext();
  return (
    <div className="w-full">
      <button
        disabled={loadingButton || loading}
        onClick={onClick}
        className={`rounded-md py-2 px-3 text-sm w-full  ${
          !isCancel
            ? `bg-[#697565] hover:bg-[#474f44] text-white`
            : `bg-transparent  border  ${
                darkmode
                  ? "text-white border-gray-800 hover:bg-[#121212]"
                  : "text-gray-900 hover:bg-slate-50"
              }`
        } font-medium  flex items-center justify-center`}
      >
        {!loadingButton ? text : <Loading />}
      </button>
    </div>
  );
}
