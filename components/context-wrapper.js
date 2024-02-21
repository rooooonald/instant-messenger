"use client";

import AuthContextProvider from "@/store/auth-context";
import NotificationContextProvider from "@/store/notification-context";

export default function ContextWrapper({ children }) {
  return (
    <AuthContextProvider>
      <NotificationContextProvider>{children}</NotificationContextProvider>
    </AuthContextProvider>
  );
}
