import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { useNotification } from "../../context/NotificationContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import Button from "../Button";
import ShowImage from "./ShowImage";
import { useStateContext } from "../../context/StateContext";
import PictNull from "../PictNull";
import { useModalContext } from "../../context/ModalContext";

export default function Details({ onCancel }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const { setLoadingButton, loadingButton, loading } = useStateContext();
  const { showDetails, setShowDetails } = useModalContext();
  const [receiverUsers, setReceiverUsers] = useState([]);
  const { chatId } = useChatStore();
  const modalRef = useRef(null);

  const { currentUser } = useUserStore();
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClose() {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  }

  function toggleAccordion() {
    setIsAccordionOpen((prev) => !prev);
  }

  const handleblock = async () => {
    setLoadingButton(true);
    if (!user) {
      setLoadingButton(false);
      return;
    }
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
      if (isReceiverBlocked) {
        notifySuccess("User has been unblocked successfully");
      } else {
        notifySuccess("User has been blocked successfully");
      }
      setLoadingButton(false);
    } catch (error) {
      console.log(error);
      notifyError(error.message);
      setLoadingButton(false);
    }
  };

  const handleClear = async () => {
    setLoadingButton(true);

    if (!user) {
      setLoadingButton(false);
      return;
    }

    const chatDocRef = doc(db, "chats", chatId);
    const userChatDocRef = doc(db, "userChats", currentUser.id);
    const userChatAnotherDocRef = doc(db, "userChats", user.id);

    try {
      await updateDoc(chatDocRef, { messages: [] });

      const updateUserChats = async (userChatRef) => {
        const userChatDoc = await getDoc(userChatRef);
        if (userChatDoc.exists()) {
          const userChatData = userChatDoc.data();
          const chats = userChatData.chats || [];
          const chatIndex = chats.findIndex((chat) => chat.chatId === chatId);
          if (chatIndex !== -1) {
            chats[chatIndex].lastMessage = "";
            await updateDoc(userChatRef, { chats });
          }
        }
      };

      await Promise.all([
        updateUserChats(userChatDocRef),
        updateUserChats(userChatAnotherDocRef),
      ]);

      notifySuccess("Chat has been cleared successfully");
    } catch (error) {
      console.log(error);
      notifyError(error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const getFriends = async () => {
      try {
        const userDocRef = doc(db, "userChats", user?.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const chats = userData.chats || [];
          const receiverIds = chats.map((chat) => chat.receiverId);

          if (receiverIds.length > 0) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("id", "in", receiverIds));
            const querySnapshot = await getDocs(q);

            const usersArray = querySnapshot.docs.map((doc) => doc.data());
            setReceiverUsers(usersArray);
          }
        } else {
          console.log("Dokumen tidak ditemukan!");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (currentUser?.id) {
      getFriends();
    }
  }, [currentUser]);

  // Swipe event handling
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
      if (touchEndX - touchStartX > 50) {
        handleClose(); // Swipe right to close
      }
    }

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener("touchstart", handleTouchStart);
      modalElement.addEventListener("touchmove", handleTouchMove);
      modalElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("touchstart", handleTouchStart);
        modalElement.removeEventListener("touchmove", handleTouchMove);
        modalElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const userDocRef = doc(db, "userChats", user?.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const chats = userData.chats || [];
          const receiverIds = chats.map((chat) => chat.receiverId);

          if (receiverIds.length > 0) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("id", "in", receiverIds));
            const querySnapshot = await getDocs(q);

            // Mengambil data user yang sesuai
            const usersArray = querySnapshot.docs.map((doc) => doc.data());
            setReceiverUsers(usersArray);
          }
        } else {
          console.log("Dokumen tidak ditemukan!");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (currentUser?.id) {
      getFriends();
    }
  }, [currentUser]);

  const darkmode = currentUser?.darkmode;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 ${
          darkmode ? "bg-white bg-opacity-10" : "bg-black bg-opacity-50"
        }  flex justify-end items-center p-1`}
      >
        <div
          ref={modalRef}
          className={`${
            darkmode ? "bg-[#0b0b0b]" : "bg-white"
          } p-4 shadow-lg h-full rounded-md w-full md:w-80 transition-transform duration-200 ${
            isExiting ? "animate-slideOut" : "animate-slideIn"
          } relative`}
        >
          {/* Modal Content */}
          <div className="flex flex-col justify-center items-center w-full gap-3">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt=""
                className="w-20 h-20 rounded-full cursor-pointer hover:opacity-50"
                onClick={() => setShowImage(true)}
              />
            ) : (
              <PictNull size={20} iconsize="3xl" />
            )}

            <div className="flex flex-col justify-center items-center">
              <p
                className={`font-semibold mb-0.5 ${
                  darkmode ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.name}
              </p>
              <p
                className={`text-[#697565] text-xs mb-1 p-1 rounded-md border ${
                  darkmode
                    ? "border-gray-800 hover:bg-[#121212]"
                    : "hover:bg-slate-50"
                }`}
              >
                @{user?.username}
              </p>
              <p
                className={`${
                  darkmode ? "text-gray-400" : "text-gray-600"
                } text-xs`}
              >
                {user?.email}
              </p>
              {user?.status ? (
                <p
                  className={`${
                    darkmode ? "text-gray-400" : "text-gray-600"
                  } text-xs mt-1 italic`}
                >
                  {" "}
                  "{user?.status}"
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">No status</p>
              )}
            </div>
          </div>

          <button
            className={`mt-4 px-3 py-2 text-sm font-medium w-full ${
              darkmode
                ? "bg-[#121212] text-white"
                : "bg-slate-100 text-gray-900"
            }  rounded-md focus:outline-none text-left relative`}
            onClick={toggleAccordion}
          >
            Friends
            <FiChevronDown className="absolute right-3 top-2.5 text-lg" />
          </button>

          {isAccordionOpen && (
            <div className="pt-2 rounded-md space-y-3 text-sm overflow-y-auto max-h-60">
              {receiverUsers.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 ${
                    darkmode ? "hover:bg-[#121212]" : "hover:bg-slate-100"
                  } p-2 rounded-md`}
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
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
                      }`}
                    >
                      {item.name}
                    </h1>
                    <p className="text-xs text-gray-400">@{item.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              disabled={loadingButton || loading}
              onClick={handleblock}
              className={`mb-2 py-2 px-3 text-sm w-full ${
                isCurrentUserBlocked || isReceiverBlocked ? "opacity-50" : ""
              } bg-red-500 text-white rounded-md focus:outline-none`}
            >
              {isCurrentUserBlocked || isReceiverBlocked ? "Blocked" : "Block"}
            </button>

            <Button isCancel={true} text="Clear chat" onClick={handleClear} />
          </div>
        </div>
      </div>
      {showImage && (
        <ShowImage url={user?.avatar} onCancel={() => setShowImage(false)} />
      )}
    </>
  );
}
