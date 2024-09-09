import React, { useState } from "react";
// store
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import PictNull from "../PictNull";

export default function BubbleChat({
  messages,
  time,
  date,
  img,
  senderId,
  senderName,
  senderAvatar,
  showImage,
}) {
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const { isReceiverBlocked, isCurrentUserBlocked } = useChatStore();
  const isMe = currentUser.id === senderId;

  const handleImage = (url) => {
    showImage(url);
  };

  return (
    <>
      <div className={`flex items-start gap-3 ${isMe && "flex-row-reverse"}`}>
        {senderAvatar && !isCurrentUserBlocked && !isReceiverBlocked ? (
          <img
            src={senderAvatar}
            alt={senderName}
            className="w-9 h-9 rounded-full border"
          />
        ) : (
          <PictNull size={9} />
        )}

        <div className="flex flex-col space-y-0.5 max-w-xs">
          <div className={`flex ${isMe && "flex-row-reverse"}`}>
            <h1
              className={`text-xs ${
                darkmode ? "text-white" : "text-gray-900"
              }  font-medium ${
                isCurrentUserBlocked || isReceiverBlocked ? "italic" : ""
              }`}
            >
              {isCurrentUserBlocked || isReceiverBlocked
                ? "[Blocked]"
                : senderName}
            </h1>
          </div>

          {img && (
            <img
              src={img}
              alt={messages[0]}
              className="rounded-md max-w-[250px] hover:opacity-50 cursor-pointer"
              onClick={() => handleImage(img)}
            />
          )}

          <div className={`space-y-0.5 flex flex-col ${isMe && "items-end"}`}>
            {messages.map((msg, idx) => (
              <p
                key={idx}
                className={`${
                  msg !== "" ? "block" : "hidden"
                } p-2.5 rounded-lg text-xs shadow-md max-w-full w-fit break-words  ${
                  isMe
                    ? "bg-[#697565] text-white"
                    : ` ${
                        darkmode
                          ? "bg-[#0b0b0b] text-white"
                          : "bg-white text-gray-900"
                      }`
                }`}
              >
                {msg}
              </p>
            ))}
          </div>

          <p
            className={`${
              darkmode ? "text-gray-400" : "text-gray-600"
            } text-[10px] ${!isMe ? "text-right" : "text-left"}`}
          >
            {time}
          </p>
        </div>
      </div>
    </>
  );
}
