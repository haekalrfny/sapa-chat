import React, { useEffect, useState } from "react";
// icons
import { FiUser } from "react-icons/fi";
// store
import { useUserStore } from "../../lib/userStore";
// firebase
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useStateContext } from "../../context/StateContext";
import PictNull from "../PictNull";

export default function UserLists({ searchTerm }) {
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { changeChat, user } = useChatStore();
  const { isSidebarOpen, setIsSidebarOpen } = useStateContext();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = (chat) => {
    changeChat(chat.chatId, chat.user);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-hidden">
      <div className="mb-2">
        <h2
          className={`text-sm font-medium ${
            darkmode ? "text-white" : "text-gray-400"
          } `}
        >
          Direct Messages
        </h2>
      </div>
      <ul className="overflow-y-auto h-full space-y-1.5">
        {filteredChats.map((chat) => (
          <li
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            className={`flex items-center p-2 ${
              darkmode ? "hover:bg-[#121212]" : "hover:bg-slate-100"
            }  rounded-md cursor-pointer ${
              chat?.user.id === user?.id && !darkmode
                ? "bg-slate-100"
                : chat?.user.id === user?.id && darkmode
                ? "bg-[#121212]"
                : ""
            }`}
          >
            {chat.user.avatar ? (
              <img
                src={chat.user.avatar}
                alt=""
                className="w-9 h-9 rounded-full border"
              />
            ) : (
              <PictNull size={9} />
            )}
            <div className="ml-3">
              <div
                className={`font-medium text-sm ${
                  darkmode ? "text-white" : "text-gray-900"
                } `}
              >
                {chat.user.name}
              </div>
              <div className="truncate w-52 flex items-center gap-1">
                <p
                  className={`text-xs ${
                    darkmode ? "text-gray-400" : "text-gray-500"
                  } `}
                >
                  {chat.lastMessage ? chat.lastMessage : "No messages yet"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
