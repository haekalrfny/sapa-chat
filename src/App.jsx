import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// home
import Home from "./pages/home/Home";
// loading
import LoadingPage from "./pages/loading/LoadingPage";
// context
import { StateContext } from "./context/StateContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ModalContext } from "./context/ModalContext";
// firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
// store
import { useUserStore } from "./lib/userStore";

export default function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <StateContext>
      <ModalContext>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {currentUser ? (
                <>
                  <Route path="/" element={<Home />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </>
              )}
              <Route
                path="*"
                element={<Navigate to={currentUser ? "/" : "/login"} />}
              />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </ModalContext>
    </StateContext>
  );
}
