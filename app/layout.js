import ContextWrapper from "@/components/main-interface/context-wrapper";
import "./globals.css";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "What's Said Here. Forgotten Here.",
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
