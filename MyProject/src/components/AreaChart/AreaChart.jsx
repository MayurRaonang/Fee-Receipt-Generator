import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import BASE_URL from "../../assets/assets";

export default function GrowthChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const token = localStorage.getItem("token"); // Or sessionStorage, depending on where you store it
        const res = await axios.get(`${BASE_URL}/monthly-growth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
        console.log("Growth data fetched:", res.data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchGrowthData();
  }, []);

  return (
    <AreaChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="students" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}
