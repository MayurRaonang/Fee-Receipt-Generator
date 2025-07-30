import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../assets/assets";

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/monthly-revenue`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRevenueData(res.data);
        console.log("Revenue data fetched:", res.data);
      } catch (err) {
        console.error("Error fetching revenue data", err);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <BarChart width={400} height={250} data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="revenue" fill="#8884d8" />
    </BarChart>
  );
}
