import React, { useState, useEffect, useRef } from "react";
import BubbleChat from "./BubbleChat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { FiLock, FiMessageCircle } from "react-icons/fi";
import ShowImage from "./ShowImage";
import { useUserStore } from "../../lib/userStore";

export default function ChatPages() {
  const [chat, setChat] = useState([]);
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { chatId } = useChatStore();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        const messages = res.data().messages.map((message) => {
          const createdAt = message.createdAt?.toDate();
          const formattedTime = createdAt
            ? createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Unknown time";
          const formattedDate = createdAt
            ? createdAt.toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown date";

          return {
            ...message,
            time: formattedTime,
            date: formattedDate,
          };
        });

        // Grouping messages with the same time and senderId
        const groupedMessages = [];
        messages.forEach((message, index) => {
          const previousMessage = groupedMessages[groupedMessages.length - 1];
          if (
            previousMessage &&
            previousMessage.time === message.time &&
            previousMessage.senderId === message.senderId
          ) {
            previousMessage.messages.push(message.text);
          } else {
            groupedMessages.push({
              ...message,
              messages: [message.text],
            });
          }
        });

        setChat(groupedMessages);
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  useEffect(() => {
    if (chat.length > 0) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  const handleShowImage = (url) => {
    setImageOpen(true);
    setImageUrl(url);
  };

  const closeImage = () => {
    setImageOpen(false);
    setImageUrl(null);
  };

  return (
    <>
      {chat.length > 0 ? (
        <div
          ref={chatContainerRef}
          className={`h-full overflow-auto ${
            darkmode ? "bg-[#121212]" : "bg-slate-100"
          }  p-4`}
        >
          <div
            className={`text-[10px]  flex items-center justify-center pt-3 pb-6`}
          >
            <p
              className={`${
                darkmode
                  ? "bg-[#0b0b0b] text-gray-400"
                  : "bg-slate-200 text-gray-600"
              }  py-1 px-2 rounded-md flex items-center justify-center gap-1`}
            >
              <FiLock className="text-xl md:text-xs" />
              Messages are end-to-end encrypted. No one outside of this chat,
              not even Sapa, can read or listen to them. Select to learn more
            </p>
          </div>
          <div className="space-y-4">
            {chat.map((message, index) => {
              const isFirstMessageOfDay =
                index === 0 || message.date !== chat[index - 1]?.date;

              return (
                <div key={index}>
                  {isFirstMessageOfDay && (
                    <div
                      className={`flex justify-center text-xs text-gray-500 mb-4`}
                    >
                      <p>{message.date}</p>
                    </div>
                  )}
                  <BubbleChat
                    messages={message?.messages}
                    time={message?.time}
                    date={message?.date}
                    senderId={message?.senderId}
                    senderName={message?.senderName}
                    senderAvatar={message?.senderAvatar}
                    img={message?.img}
                    showImage={handleShowImage}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={`h-full w-full flex flex-col justify-center items-center ${
            darkmode
              ? "bg-[#121212] text-gray-400"
              : " bg-slate-100 text-gray-600"
          } text-center`}
        >
          <FiMessageCircle className=" text-xl mb-1" />
          <p className=" text-sm">No messages yet!</p>
        </div>
      )}
      {imageOpen && <ShowImage url={imageUrl} onCancel={closeImage} />}
    </>
  );
}
