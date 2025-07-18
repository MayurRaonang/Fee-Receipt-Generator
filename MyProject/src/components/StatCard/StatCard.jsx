import React from "react";
import "./StatCard.css";

export default function StatCard({ title, value, color, icon, trend }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`stat-card-trend ${trend < 0 ? 'negative' : ''}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  );
}