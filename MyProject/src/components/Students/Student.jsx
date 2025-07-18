import React, { useState, useEffect } from "react";
import "./Student.css";
import Sidebar from "../Sidebar/Sidebar";
import BASE_URL from "../../assets/assets";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    standard: "",
    email: "",
    totalFees: ""
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { 
        console.error("No token found");
        alert("You must be logged in to register a student.");
        return;
      }
      const res = await fetch(`${BASE_URL}/students`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting student data:", formData);
      if (!token) { 
        console.error("No token found");
        alert("You must be logged in to register a student.");
        return;
      }
        console.log("Token:", token);
        console.log("Form data:", formData);

      const res = await fetch(`${BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Student registered successfully.");
        setFormData({ name: "", standard: "", email: "", totalFees: "" });
        fetchStudents();
      } else {
        alert("Failed to register student.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.standard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-container">
      <div className="sidebar">
              <Sidebar />
      </div>
      <div className="student-header">
        <h1>Student Management</h1>
        <p>Register new students and manage existing records</p>
      </div>

      {/* Registration Form */}
      <div className="form-section">
        <div className="form-card">
          <h2>Register New Student</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="standard">Standard/Class</label>
              <input
                id="standard"
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                placeholder="Enter class/standard"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                type="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalFees">Total Fees</label>
              <input
                id="totalFees"
                name="totalFees"
                value={formData.totalFees}
                onChange={handleChange}
                placeholder="Enter total fees amount"
                type="number"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Register Student"}
            </button>
          </form>
        </div>
      </div>

      {/* Students List */}
      <div className="students-section">
        <div className="students-header">
          <h2>All Students ({filteredStudents.length})</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading">Loading students...</div>
          ) : (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Standard</th>
                  <th>Email</th>
                  <th>Total Fees</th>
                  <th>Fees Paid</th>
                  <th>Payment Mode</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      {searchTerm ? "No students found matching your search." : "No students found."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="student-name">{student.name}</td>
                      <td>{student.standard}</td>
                      <td>{student.email}</td>
                      <td className="fees">₹{student.totalFees}</td>
                      <td className="fees">₹{student.feesPaid || 0}</td>
                      <td>{student.paymentMode || "Not specified"}</td>
                      <td>{student.paymentDate ? new Date(student.paymentDate).toLocaleDateString() : "Not paid"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}