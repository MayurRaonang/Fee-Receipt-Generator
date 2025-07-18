// import React from "react";
// import "../assets/login_register.css";
// import { useNavigate, Link } from "react-router-dom";
// import { div } from "motion/react-client";

// function Login() {
//   console.log("isAuthenticated:", localStorage.getItem("isAuthenticated"));
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const username = e.target.username.value;
//     const password = e.target.password.value;

//     try {
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("isAuthenticated", "true");
//         navigate("../Dashboard");
//       } else {
//         alert(data.error || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="login_container">
//     <div className="register_container">
//       <div className="register_logo">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="46"
//           height="46"
//           fill="currentColor"
//           className="bi bi-compass"
//           viewBox="0 0 16 16"
//         >
//           <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
//           <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
//         </svg>
//         Career Compass
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="form_item">
//           <input
//             type="text"
//             placeholder="Username"
//             id="username"
//             name="username"
//             required
//           />
//         </div>
//         <div className="form_item">
//           <input
//             type="password"
//             placeholder="Password"
//             id="password"
//             name="password"
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//         <p className="sign-in-text">
//           Don't have an account? <Link to="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//     </div>
//   );
// }

// export default Login;
import React from "react";
import "../assets/login_register.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store JWT token
        localStorage.setItem("token", data.token);

        // ✅ Optionally store user role
        localStorage.setItem("role", data.role);

        // ✅ Redirect to dashboard
        // console.log(data.role);
        if(data.role === "admin") {
        navigate("/dashboard");
        }
        else if(data.role === "student") {
          navigate("/student");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
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
            <input
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              required
            />
          </div>
          <div className="form_item">
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              required
            />
          </div>
          <button type="submit">Login</button>
          <p className="sign-in-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
