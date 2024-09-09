// Chats.jsx
import React from "react";
// components
import Headers from "./Headers";
import ChatPages from "./ChatPages";
import InputChat from "./InputChat";

export default function Chats() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div>
        <Headers />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatPages />
      </div>
      <div>
        <InputChat />
      </div>
    </div>
  );
}
