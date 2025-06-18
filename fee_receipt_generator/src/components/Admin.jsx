import React from "react";
import "../assets/admin.css"; // create this file for styling
import { Link } from "react-router-dom";

function Admin() {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="logo">Career Compass - Admin</div>
        <div className="nav-links">
          <Link to="/science">Science</Link>
          <Link to="/commerce">Commerce</Link>
          <Link to="/ssc">SSC</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="admin-content">
        <h2>Important Updates & Notices</h2>
        <ul className="notice-list">
          <li>📢 NEET 2025 forms will be released on July 10.</li>
          <li>📢 SSC exam schedule will be announced next week.</li>
          <li>📢 FYJC admissions begin from June 25.</li>
          <li>📢 Science project exhibition dates extended to August 10.</li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
