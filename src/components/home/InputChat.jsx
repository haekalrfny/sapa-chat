import React, { useState, useRef, useEffect } from "react";
import { FiSmile, FiCamera, FiImage, FiMic, FiFile } from "react-icons/fi";
import { LuSendHorizonal } from "react-icons/lu";
import Input from "../Input";
import EmojiPicker from "emoji-picker-react";
import { useNotification } from "../../context/NotificationContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import SendImage from "./SendImage";
import upload from "../../lib/upload";

export default function InputChat() {
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [imageOpen, setImageOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const { notifyError } = useNotification();
  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const emojiPickerRef = useRef(null);

  const handleSend = async () => {
    if (!text && !img.file) {
      notifyError("Please enter a message");
      return;
    }

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
      notifyError(error.message);
    }
    setText("");
    setImg({ file: null, url: "" });
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  return (
    <>
      <div
        className={`flex items-center justify-between gap-6 py-3 px-6 ${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setEmojiPickerOpen((prev) => !prev)}
              className={`${
                darkmode
                  ? "hover:bg-[#121212] text-white"
                  : "hover:bg-slate-100"
              } p-1 rounded-md`}
            >
              <FiSmile className="text-xl" />
            </button>
            {emojiPickerOpen && (
              <div ref={emojiPickerRef} className="absolute bottom-12 left-0">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <button
            onClick={() => setImageOpen(true)}
            className={`${
              darkmode ? "hover:bg-[#121212] text-white" : "hover:bg-slate-100"
            } p-1 rounded-md`}
          >
            <FiImage className="text-xl" />
          </button>
        </div>

        <Input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You can't send a message"
              : "Type a message..."
          }
          value={text}
          setValue={setText}
          isHide={true}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
          onSubmit={handleSend}
        />

        <button
          disabled={isReceiverBlocked || isCurrentUserBlocked}
          onClick={handleSend}
          className={`text-[#697565] ${
            isCurrentUserBlocked || isReceiverBlocked
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          <LuSendHorizonal className="text-2xl" />
        </button>
      </div>
      {imageOpen && (
        <SendImage
          setValue={setImg}
          onCancel={() => setImageOpen(false)}
          onClick={handleSend}
        />
      )}
    </>
  );
}
