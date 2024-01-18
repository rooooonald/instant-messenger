import { createContext, useState } from "react";

export const NotificationContext = createContext({
  notification: {},
  addNotification: () => {},
  removeNotification: () => {},
});

export default function NotificationContextProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const addNotificationHandler = (content) => {
    setNotification(content);
  };

  const removeNotificationHandler = () => {
    setNotification(null);
  };

  const context = {
    notification,
    addNotification: addNotificationHandler,
    removeNotification: removeNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
}
