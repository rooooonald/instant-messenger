import ContextWrapper from "@/components/context-wrapper";
import "./globals.css";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "400", "700"],
  variable: "--font-urbanist",
});

export const metadata = {
  title: "Forgotten Messenger",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ContextWrapper>{children}</ContextWrapper>
        <div id="backdrop"></div>
        <div id="notification"></div>
      </body>
    </html>
  );
}
