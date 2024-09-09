import React, { useEffect, useRef, useState } from "react";
// context
import { useNotification } from "../../context/NotificationContext";
import { useStateContext } from "../../context/StateContext";
// components
import Search from "../Search";
// firebase
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
// icons
import { FiPlus, FiUser, FiX } from "react-icons/fi";
// store
import { useUserStore } from "../../lib/userStore";
import Loading from "../Loading";
import PictNull from "../PictNull";

export default function AddUser({ onCancel }) {
  const [isExiting, setIsExiting] = useState(false);
  const [username, setUsername] = useState("");
  const [trying, setTrying] = useState(false);
  const [user, setUser] = useState(null);
  const { notifySuccess, notifyError, notifyFind } = useNotification();
  const { setLoading, loading } = useStateContext();
  const { currentUser } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const modalRef = useRef(null);
  const [isFriend, setIsFriend] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        fetchUserChats(querySnapshot.docs[0].data().id);
      } else {
        setUser(null);
        notifyError("User not found");
        setTrying(true);
        setLoading(false);
        return;
      }
      notifyFind("User found");
      setLoading(false);
    } catch (error) {
      console.log(error);
      notifyError(error.message);
      setLoading(false);
    }
  };

  const fetchUserChats = async (id) => {
    try {
      const userChatsRef = collection(db, "userChats");
      const querySnapshot = await getDocs(userChatsRef);
      const chats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredChat = chats?.find((i) => i.id === id);
      const findUser = filteredChat?.chats?.find(
        (i) => i.receiverId === currentUser.id
      );
      setIsFriend(findUser ? true : false);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

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

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      notifySuccess("Just made a new friend!");
      handleClose();
    } catch (error) {
      console.log(error);
      notifyError(error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        darkmode ? "bg-white bg-opacity-10" : "bg-black bg-opacity-50"
      }  flex justify-center items-center`}
    >
      <div
        ref={modalRef}
        className={` ${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        } p-6 rounded-lg shadow-lg w-full max-w-sm  ${
          isExiting ? "animate-slidefromTop" : "animate-slideFromBottom"
        }`}
      >
        <div className="flex w-full justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold ${
              darkmode ? "text-white" : "text-gray-900"
            }`}
          >
            Discover Friends
          </h2>
          <button
            onClick={handleClose}
            className={`p-1 rounded-md ${
              darkmode ? "hover:bg-[#121212] text-white" : "hover:bg-slate-100"
            }`}
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <p
          className={`${
            darkmode ? "text-gray-300" : "text-gray-600"
          } text-sm mb-3`}
        >
          Search the username of the account you want to add.
        </p>
        <Search
          value={username}
          setValue={setUsername}
          onSubmit={handleSearch}
          isUsername={true}
        />
        <p className="text-xs text-red-500 pt-1">
          {trying && !user && "Must be an exact match."}
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <Loading />
          </div>
        ) : (
          user && (
            <div
              className={`flex items-center justify-between gap-3 ${
                darkmode ? "hover:bg-[#121212]" : "hover:bg-slate-100"
              } p-2 rounded-md mt-2`}
            >
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <PictNull size={9} />
                )}
                <h1
                  className={`text-sm font-medium ${
                    darkmode ? "text-white" : "text-gray-900"
                  }`}
                >
                  @{user.username}
                </h1>
              </div>

              {currentUser.id !== user.id && !isFriend ? (
                <button
                  onClick={handleAdd}
                  className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-gray-900"
                >
                  <FiPlus />
                </button>
              ) : isFriend ? (
                <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-green-100 text-green-500 font-medium italic">
                  <p>Friend</p>
                </div>
              ) : (
                <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-300 text-gray-900 font-medium italic">
                  <p>You</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
