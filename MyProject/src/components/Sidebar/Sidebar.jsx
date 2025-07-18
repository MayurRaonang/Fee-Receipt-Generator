import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 👈 remove token
    alert("You have been logged out."); // optional
    navigate("/login"); // 👈 redirect to login
  };
  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={closeSidebar}>
          ×
        </button>

        <h2>Admin Panel</h2>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/student" className={({ isActive }) => isActive ? "active" : ""}>Students</NavLink>
          </li>
          <li>
            <NavLink to="/notification" className={({ isActive }) => isActive ? "active" : ""}>Notifications</NavLink>
          </li>
          <li>
            <NavLink to="/fees" className={({ isActive }) => isActive ? "active" : ""}>Fees</NavLink>
          </li>
          <li>
            <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
