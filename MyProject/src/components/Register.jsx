import React, { useState } from "react";
import "../assets/login_register.css";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../assets/assets";

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
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
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
    <div className="login_container"> 
    <div className="register_container">
      <div className="register_logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-compass"
                viewBox="0 0 16 16"
              >
                <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
              </svg>
              Career Compass
            </div>
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
        <div className="form_item">
          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        </div>
        <div className="form_item">
          <input type="text" name="insname" placeholder="Institute Name" onChange={handleChange} required />
        </div>
        <div className="form_item">
          <input type="text" name="tagline" placeholder="Tagline" onChange={handleChange} required />
        </div>
        <div className="form_item">
          <input type="text" name="insaddress" placeholder="Institute Address" onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
        <p className="sign-in-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
    </div>
  );
}

export default Register;
