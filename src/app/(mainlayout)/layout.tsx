import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";
import { Toaster } from "sonner";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Toaster />
      <Footer />
    </>
  );
};

export default MainLayout;
