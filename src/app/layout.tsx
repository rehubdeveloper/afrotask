import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { UserPen } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/UserContext";
import { UIProvider } from "./contexts/UIContext";

export const metadata: Metadata = {
  title: "AfroTask",
  description: "Built By Silas Okanlawon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <UserProvider>
        <UIProvider>
          <body
            className={`antialiased`}
          >
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            {children}
            <Footer />
          </body>
        </UIProvider>
      </UserProvider>
    </html>
  );
}
