import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your components
import Login from "./components/Login";
import Admin from "./components/Admin";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route shows login */}
        <Route path="/" element={<Login />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<Admin />} />

        {/* Register route */}
        <Route path="/register" element={<Register />} />
        
        {/* Redirect to login for any other route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
