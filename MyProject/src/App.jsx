// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./components/PrivateRoute";
// // Import your components
// import Login from "./components/Login";
// import Admin from "./components/Admin";
// import Student from "./components/Student";
// import Register from "./components/Register";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Fees from "./components/Fees/Fees";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Default route shows login */}
//         <Route path="/" element={<Login />} />

//         {/* Admin dashboard */}
//         <Route path="/dashboard" element={
//           <PrivateRoute>
//           <Dashboard />
//           </PrivateRoute>} />

//         {/* Student dashboard */}
//         <Route path="/student" element={<Student />} />

//         {/* Register route */}
//         <Route path="/register" element={<Register />} />
        
//         {/* Redirect to login for any other route */}
//         <Route path="/login" element={<Login />} />

//         <Route path="/fees" element={<Fees />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Student from "./components/Students/Student";
import StudentInfo from "./components/StudentInfo/StudentInfo";
import Notification from "./components/Notification";
import Fees from "./components/Fees/Fees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/student"
          element={
            <PrivateRoute>
              <Student />
            </PrivateRoute>
          }
        />
        <Route path="/student-info" element={<PrivateRoute><StudentInfo /></PrivateRoute>} />

        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        />

        <Route
          path="/fees"
          element={
            <PrivateRoute>
              <Fees />
            </PrivateRoute>
          }
        />

        {/* Optional: 404 Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
