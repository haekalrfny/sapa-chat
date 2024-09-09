import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import Input from "../../components/Input";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Stepper from "../../components/Stepper";
import UploadAvatar from "../../components/auth/UploadAvatar";
import NavigateEachOther from "../../components/auth/NavigateEachOther";
// firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
// context
import { useStateContext } from "../../context/StateContext";
import { useNotification } from "../../context/NotificationContext";
// lib
import upload from "../../lib/upload";

export default function Register() {
  // state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userResponse, setUserResponse] = useState(null);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  // context
  const { setLoadingButton } = useStateContext();
  const { notifySuccess, notifyError } = useNotification();
  // navigate
  const navigate = useNavigate();

  const handleNextStep = async () => {
    setLoadingButton(true);

    switch (true) {
      case !username || !email || !password:
        notifyError("Please fill in all fields");
        setLoadingButton(false);
        return;
      case !agree:
        notifyError("Please agree to our terms and conditions");
        setLoadingButton(false);
        return;
      case currentStep === 1:
        try {
          const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          setUserResponse(response);
          setCurrentStep(2);
          notifySuccess("Account created successfully");
        } catch (error) {
          console.log(error);
          notifyError(error.message);
        }
        break;
      default:
        setLoadingButton(false);
        return false;
    }
    setLoadingButton(false);
  };

  const handleSubmit = async (e, skipAvatar = false) => {
    e.preventDefault();
    setLoadingButton(true);

    if (!userResponse) {
      notifyError("No user response available");
      setLoadingButton(false);
      return;
    }

    try {
      let imgUrl = null;

      if (skipAvatar) {
        imgUrl = null;
      } else {
        if (!avatar?.file) {
          notifyError("Please upload your avatar");
          setLoadingButton(false);
          return;
        }
        imgUrl = await upload(avatar.file);
      }

      await setDoc(doc(db, "users", userResponse.user.uid), {
        name,
        username,
        email,
        avatar: imgUrl,
        id: userResponse.user.uid,
        darkmode: false,
        status: "",
        blocked: [],
      });

      await setDoc(doc(db, "userChats", userResponse.user.uid), {
        chats: [],
      });

      setLoadingButton(false);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
      notifyError(error.message);
      setLoadingButton(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-3 w-3/4 sm:w-2/4 md:w-1/4">
        <Stepper
          steps={["Personal details", "Photo Profile"]}
          currentStep={currentStep}
        />
        <div>
          <h1 className="font-semibold text-xl">
            {currentStep === 1 ? "Create your account" : "Add your photo"}
          </h1>
          <p className="text-sm text-gray-500">
            {currentStep === 1
              ? "Enter your personal details"
              : "Add your photo profile"}
          </p>
        </div>

        {currentStep <= 1 ? (
          <>
            <div className="space-y-1.5">
              <Input
                name="Username"
                type="text"
                placeholder="example_123"
                value={username}
                setValue={setUsername}
                isRequired
                isUsername
              />
              <Input
                name="Name"
                type="text"
                placeholder="Example"
                value={name}
                setValue={setName}
                isRequired
              />
              <Input
                name="Email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                setValue={setEmail}
                isRequired
              />
              <Input
                name="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                setValue={setPassword}
                isRequired
              />
            </div>
            <Checkbox
              text="I agree with the terms and conditions"
              setValue={setAgree}
            />
          </>
        ) : (
          <UploadAvatar setValue={setAvatar} />
        )}
        <div className="flex gap-2">
          <Button
            text={currentStep <= 1 ? "Next" : "Upload"}
            onClick={
              currentStep <= 1 ? handleNextStep : (e) => handleSubmit(e, false)
            }
          />
          {currentStep > 1 && (
            <Button
              text="Skip"
              onClick={(e) => handleSubmit(e, true)}
              isCancel={true}
            />
          )}
        </div>
        {currentStep <= 1 && (
          <NavigateEachOther
            link="/login"
            linkName="Login"
            text="Already have an account?"
          />
        )}
      </div>
    </div>
  );
}
