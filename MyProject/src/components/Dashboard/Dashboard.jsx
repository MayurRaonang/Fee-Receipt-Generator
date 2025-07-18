import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import StatCard from "../StatCard/StatCard";
import GrowthChart from "../AreaChart/AreaChart";
import RevenueChart from "../BarChart/BarChart";
import "./Dashboard.css";
import axios from "axios";
import BASE_URL from "../../assets/assets";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    fullyPaid: 0,
    remaining: 0,
  });

  const userId = localStorage.getItem("userId"); // Or get from auth context

  useEffect(() => {
    axios
      .get(`${BASE_URL}/dashboard-stats`)
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard stats", err);
      });
  }, [userId]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <div className="topbar">
          <Topbar />
        </div>
        <div className="stat-grid">
          <StatCard title="Total Students" value={stats.totalStudents} color="blue" icon="👥" />
          <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} color="green" icon="💰" />
          <StatCard title="Fully Paid" value={stats.fullyPaid} color="purple" icon="✅" />
          <StatCard title="Remaining" value={stats.remaining} color="orange" icon="⚠️" />
        </div>
        <div className="charts">
          <div className="chart-container">
            <h3 className="chart-title">Student Growth</h3>
            <GrowthChart />
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Revenue Trends</h3>
            <RevenueChart />
          </div>
        </div>
      </div>
    </div>
  );
}
