import React from "react";
import Navbar from "./NavBarC";
import Footer from "./FooterC";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow" style={{background: "#0b0b0c"}}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
