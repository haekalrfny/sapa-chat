import React, { createContext, useContext, useState, useEffect } from "react";
import { TbCheck, TbExclamationCircle, TbX } from "react-icons/tb";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const soundSuccess = "/sound/success.mp3";
  const soundError = "/sound/error.mp3";
  const soundFind = "/sound/found.mp3";

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const notify = (message, type) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), text: message, type },
    ]);
    playSound(
      type === "success"
        ? soundSuccess
        : type === "error"
        ? soundError
        : soundFind
    );
  };

  const notifyError = (message) => {
    notify(message, "error");
  };

  const notifySuccess = (message) => {
    notify(message, "success");
  };

  const notifyFind = (message) => {
    notify(message, "find");
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{ notifyError, notifySuccess, notifyFind }}
    >
      {children}
      <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-[99999] flex flex-col-reverse space-y-2 w-full max-w-xs">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center w-full p-4 text-gray-500 space-x-2 bg-white rounded-lg shadow ${
              notifications.length === 1
                ? "animate-bounceIn"
                : "animate-bounceOut"
            }`}
          >
            <div
              className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
                notification.type === "success"
                  ? "text-green-500 bg-green-100"
                  : notification.type === "error"
                  ? "text-red-500 bg-red-100"
                  : "text-blue-500 bg-blue-100"
              } rounded-lg`}
            >
              {notification.type === "success" ? (
                <TbCheck />
              ) : notification.type === "error" ? (
                <TbX />
              ) : (
                <TbExclamationCircle />
              )}
            </div>
            <div className="text-sm font-normal flex-1">
              {notification.text}
            </div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
              onClick={() =>
                setNotifications((prevNotifications) =>
                  prevNotifications.filter((n) => n.id !== notification.id)
                )
              }
            >
              <TbX className="text-xl" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
