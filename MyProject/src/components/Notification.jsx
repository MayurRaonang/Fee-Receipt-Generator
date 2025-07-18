import React, { useState } from "react";
import "../assets/admin.css";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

function Notification() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const notifications = [
    {
      id: 1,
      title: "NEET 2025 Forms Released",
      text: "NEET 2025 application forms are now available. Last date to apply is August 15, 2025.",
      date: "July 10, 2025",
      category: "urgent",
      icon: "🚨"
    },
    {
      id: 2,
      title: "SSC Exam Schedule Announced",
      text: "Staff Selection Commission has announced the exam schedule for various posts. Check the official website for details.",
      date: "July 8, 2025",
      category: "important",
      icon: "📋"
    },
    {
      id: 3,
      title: "FYJC Admissions Begin",
      text: "First Year Junior College admissions have started from June 25. Submit your applications before the deadline.",
      date: "June 25, 2025",
      category: "general",
      icon: "🎓"
    },
    {
      id: 4,
      title: "Science Project Exhibition Extended",
      text: "Due to popular demand, the science project exhibition dates have been extended to August 10, 2025.",
      date: "July 5, 2025",
      category: "event",
      icon: "🔬"
    },
    {
      id: 5,
      title: "New Study Material Available",
      text: "Latest study materials for competitive exams are now available in the library and online portal.",
      date: "July 12, 2025",
      category: "general",
      icon: "📚"
    },
    {
      id: 6,
      title: "Holiday Notice",
      text: "Classes will remain closed on July 20, 2025 due to public holiday. Regular classes will resume from July 21.",
      date: "July 14, 2025",
      category: "important",
      icon: "🏖️"
    }
  ];

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.category === activeFilter);

  return (
    <div className="notification-container">
      {/* NAVBAR */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-content">
        <h2>Important Updates & Notices</h2>
        
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Notices
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'urgent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('urgent')}
          >
            Urgent
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'important' ? 'active' : ''}`}
            onClick={() => setActiveFilter('important')}
          >
            Important
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'general' ? 'active' : ''}`}
            onClick={() => setActiveFilter('general')}
          >
            General
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'event' ? 'active' : ''}`}
            onClick={() => setActiveFilter('event')}
          >
            Events
          </button>
        </div>

        {/* Notice List */}
        <ul className="notice-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <li key={notification.id} className={`notice-item ${notification.category}`}>
                <div className="notice-header">
                  <div className={`notice-icon ${notification.category}`}>
                    {notification.icon}
                  </div>
                  <div className="notice-date">
                    {notification.date}
                  </div>
                </div>
                <div className="notice-content">
                  <h3 className="notice-title">{notification.title}</h3>
                  <p className="notice-text">{notification.text}</p>
                  <span className={`notice-category ${notification.category}`}>
                    {notification.category}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              <h3>No notices found</h3>
              <p>No notices match the selected filter.</p>
            </div>
          )}
        </ul>

        {/* Add Notice Button */}
        <button className="add-notice-btn" title="Add New Notice">
          +
        </button>
      </div>
    </div>
  );
}

export default Notification;