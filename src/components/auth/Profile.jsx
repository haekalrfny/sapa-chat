import React, { useEffect, useRef, useState } from "react";
import { FiUser, FiX } from "react-icons/fi";
import { useNotification } from "../../context/NotificationContext";
import { useStateContext } from "../../context/StateContext";
import { useUserStore } from "../../lib/userStore";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";
import { db } from "../../lib/firebase";
import upload from "../../lib/upload";
import { doc, updateDoc } from "firebase/firestore";
import PictNull from "../PictNull";

export default function Profile({ onCancel }) {
  const [isExiting, setIsExiting] = useState(false);
  const [picture, setPicture] = useState({
    file: null,
    url: "",
  });
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const { notifySuccess, notifyError } = useNotification();
  const { setLoadingButton } = useStateContext();
  const { currentUser, fetchUserInfo } = useUserStore();
  const darkmode = currentUser?.darkmode;
  const [isRemove, setIsRemove] = useState(false);
  const modalRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture({
        file: selectedFile,
        url: URL.createObjectURL(selectedFile),
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setStatus(currentUser.status);
      setName(currentUser.name);
    }
  }, [currentUser]);

  const handleRemove = () => {
    setPicture({
      file: null,
      url: "",
    });
    setIsRemove(true);
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

  const handleUpdate = async () => {
    setLoadingButton(true);

    try {
      let imgUrl = currentUser.avatar;
      if (picture?.file && !isRemove) {
        imgUrl = await upload(picture.file);
      } else if (isRemove) {
        imgUrl = null;
      }

      await updateDoc(doc(db, "users", currentUser.id), {
        name,
        username,
        status,
        avatar: imgUrl,
      });

      await fetchUserInfo(currentUser.id);

      notifySuccess("Profile updated successfully");
      handleClose();
    } catch (error) {
      notifyError(error.message);
      console.log(error);
    } finally {
      setLoadingButton(false);
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
        className={`${
          darkmode ? "bg-[#0b0b0b]" : "bg-white"
        } p-6 rounded-lg shadow-lg w-full max-w-sm ${
          isExiting ? "animate-slidefromTop" : "animate-slideFromBottom"
        }`}
      >
        <div className=" flex w-full justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold ${
              darkmode ? "text-white" : "text-gray-900 "
            } `}
          >
            Edit Profile
          </h2>
          <button
            onClick={handleClose}
            className={`p-1 rounded-md ${
              darkmode ? "hover:bg-[#121212] text-white" : "hover:bg-slate-100"
            } `}
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <p
          className={`${
            darkmode ? "text-gray-300" : "text-gray-600"
          } text-sm mb-3`}
        >
          Time to amp up your profile! Keep it fresh and on point. Let’s do
          this!
        </p>
        <div className="space-y-3">
          <h1
            className={`font-medium ${
              darkmode ? "text-white" : "text-gray-900"
            }`}
          >
            Basic Information
          </h1>
          <div className="flex justify-between items-center ">
            <div className="space-y-1 text-sm">
              <h1
                className={`font-medium ${
                  darkmode ? "text-white" : "text-gray-900"
                }`}
              >
                Profile Picture
              </h1>
              <div className="space-x-1">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className={`text-xs py-1 px-2 rounded-md border ${
                    darkmode
                      ? "border-gray-800 text-white bg-[#121212]"
                      : " hover:bg-slate-100"
                  } cursor-pointer`}
                >
                  Change
                </label>
                <button
                  onClick={handleRemove}
                  className={`border text-xs py-1 px-2 rounded-md ${
                    darkmode
                      ? "border-gray-800 text-white bg-[#121212]"
                      : " hover:bg-slate-100"
                  } cursor-pointer`}
                >
                  Remove
                </button>
              </div>
            </div>
            {picture.url ? (
              <img
                src={picture.url}
                alt="uploaded"
                className="w-14 h-14 rounded-full border"
              />
            ) : currentUser?.avatar && !isRemove ? (
              <img
                src={currentUser?.avatar}
                alt="profile"
                className="w-14 h-14 rounded-full border"
              />
            ) : (
              <PictNull size={14} iconsize="2xl" />
            )}
          </div>
          <Input
            name="Username"
            type="text"
            placeholder="Please enter username"
            value={username}
            setValue={setUsername}
            isUsername={true}
          />
          <Input
            name="Name"
            type="text"
            placeholder="Please enter name"
            value={name}
            setValue={setName}
          />
          <TextArea
            name="Status"
            type="text"
            placeholder="Type something about you"
            value={status}
            setValue={setStatus}
            maxHeight="15vh"
          />
          <Button text={"Save"} onClick={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
