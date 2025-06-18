import React, { useState } from "react";
import "../assets/login_register.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="register_container">
      <div className="register_logo">Career Compass</div>
      <form onSubmit={handleSubmit}>
        <div className="form_item">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        </div>
        <div className="form_item">
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <div className="form_item">
          <input type="email" name="email" placeholder="E-mail address" onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
        <p className="sign-in-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
