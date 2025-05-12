// src/components/Layout.js
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../styles/Layout.css";

const Layout = () => {
  const location = useLocation();

  const showSidebarRoutes = ["/dashboard", "/transactions", "/budgets"];
  const showSidebar = showSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-main">
        {showSidebar && <Sidebar />}
        <div className="layout-content">
          <Outlet /> {/* This is where nested routes will render */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
