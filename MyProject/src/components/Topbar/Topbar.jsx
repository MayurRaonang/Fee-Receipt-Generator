import React from "react";
import "./Topbar.css";

export default function Topbar() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="topbar">
      <div className="text">
        <h3>Dashboard</h3>
        <p>Welcome back, Admin! Here's what's happening today.</p>
        <span className="date">{today}</span>
      </div>
    </div>
  );
}
