import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

export default function GrowthChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/monthly-growth")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching chart data:", err));
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
