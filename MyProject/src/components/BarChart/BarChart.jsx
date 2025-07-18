import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RevenueChart() {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/monthly-revenue');
        setRevenueData(res.data);
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
