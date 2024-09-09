import React, { useState } from "react";
// components
import Input from "../../components/Input";
import Button from "../../components/Button";
import NavigateEachOther from "../../components/auth/NavigateEachOther";
// react-router
import { useNavigate } from "react-router-dom";
// firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
// context
import { useStateContext } from "../../context/StateContext";
import { useNotification } from "../../context/NotificationContext";

export default function Login() {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // context
  const { setLoadingButton } = useStateContext();
  const { notifySuccess, notifyError } = useNotification();
  // navigate
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoadingButton(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoadingButton(false);
      notifySuccess("Login successful");
      setTimeout(() => {
        window.location.reload();
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      notifyError(error.message);
      setLoadingButton(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-3 w-[90%] sm:w-3/4 md:w-2/4 lg:w-1/4">
        <div>
          <h1 className="font-semibold text-xl">Welcome Back!</h1>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>
        <div className="space-y-1.5">
          <Input
            name="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            setValue={setEmail}
            isRequired
            onSubmit={handleSubmit}
          />
          <Input
            name="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            setValue={setPassword}
            isRequired
            onSubmit={handleSubmit}
          />
        </div>
        <Button text="Login" onClick={handleSubmit} />
        <NavigateEachOther
          link="/register"
          linkName="Register"
          text="Don't have an account?"
        />
      </div>
    </div>
  );
}
