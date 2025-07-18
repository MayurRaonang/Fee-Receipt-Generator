//  import Sidebar from "../Sidebar/Sidebar";
// import React, { useState } from "react";
// import "./Fees.css";
// //import Sidebar from "../components/Sidebar"; // Make sure you import Sidebar
// import { useNavigate } from "react-router-dom";

// const Fees = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     standard: "",
//     amountPaid: "",
//     email: "",
//     paymentMethod: ""
//   });

//   const [receipt, setReceipt] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setReceipt(null);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:5000/fees", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.status === 404) {
//         alert("Student not found. Please register the student first.");
//         navigate("/Student"); // Redirect to student registration page
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(data.error || "Fee submission failed");
//       }

//       setMessage("Receipt updated and sent successfully!");
//       setReceipt({
//         name: data.updatedStudent.name,
//         standard: data.updatedStudent.standard,
//         totalFees: data.updatedStudent.totalFees,
//         feesPaid: data.updatedStudent.feesPaid,
//         feesRemaining: data.updatedStudent.feesRemaining,
//         paymentMethod: formData.paymentMethod
//       });
//     } catch (error) {
//       console.error("Error submitting fee:", error.message);
//       alert("Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="fees-layout">
//       <div className="sidebar">
//         <Sidebar />
//       </div>

//       <div className="container">
//         <header>
//           <h1>Career Compass Institute</h1>
//           <p>Fee Management System</p>
//         </header>

//         <main>
//           <form className="form" onSubmit={handleSubmit}>
//             <h2>Fee Payment</h2>

//             <div className="form-group">
//               <label>Student Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Standard</label>
//               <input
//                 type="text"
//                 name="standard"
//                 value={formData.standard}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Amount Paid (₹)</label>
//               <input
//                 type="number"
//                 name="amountPaid"
//                 value={formData.amountPaid}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Payment Method</label>
//               <select
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Payment Method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//               </select>
//             </div>

//             <button type="submit" disabled={loading}>
//               {loading ? "Processing..." : "Submit Payment"}
//             </button>
//           </form>

//           {message && <div className="message">{message}</div>}

//           {receipt && (
//             <div className="receipt">
//               <h3>Fee Receipt</h3>
//               <p><strong>Student Name:</strong> {receipt.name}</p>
//               <p><strong>Standard:</strong> {receipt.standard}</p>
//               <p><strong>Total Fees:</strong> ₹{receipt.totalFees.toLocaleString()}</p>
//               <p><strong>Amount Paid:</strong> ₹{receipt.feesPaid.toLocaleString()}</p>
//               <p><strong>Remaining Balance:</strong> ₹{receipt.feesRemaining.toLocaleString()}</p>
//               <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
//               <p><strong>Payment Date:</strong> {new Date().toLocaleDateString()}</p>
//               <p>Thank you for your payment!</p>
//               <button onClick={handlePrint} className="print-button">Print Receipt</button>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Fees;
import Sidebar from "../Sidebar/Sidebar";
import React, { useState } from "react";
import "./Fees.css";
//import Sidebar from "../components/Sidebar"; // Make sure you import Sidebar
import { useNavigate } from "react-router-dom";

const Fees = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    standard: "",
    amountPaid: "",
    email: "",
    paymentMethod: ""
  });

  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setReceipt(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 404) {
        alert("Student not found. Please register the student first.");
        navigate("/Student"); // Redirect to student registration page
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Fee submission failed");
      }

      setMessage("Receipt updated and sent successfully!");
      setReceipt({
        name: data.updatedStudent.name,
        standard: data.updatedStudent.standard,
        totalFees: data.updatedStudent.totalFees,
        feesPaid: data.updatedStudent.feesPaid,
        feesRemaining: data.updatedStudent.feesRemaining,
        paymentMethod: formData.paymentMethod
      });
    } catch (error) {
      console.error("Error submitting fee:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fees-layout">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="container">
        <header>
          <h1>Career Compass Institute</h1>
          <p>Fee Management System</p>
        </header>

        <main>
          <form className="form" onSubmit={handleSubmit}>
            <h2>Fee Payment</h2>

            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Standard</label>
              <input
                type="text"
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount Paid (₹)</label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}

          {receipt && (
            <div className="receipt-container">
              <div className="receipt-card">
                {/* Header */}
                <div className="receipt-header">
                  <div className="institute-info">
                    <div className="logo-placeholder">
                      <span>📚</span>
                    </div>
                    <div className="institute-details">
                      <h2>Career Compass Institute</h2>
                      <p>Excellence in Education</p>
                    </div>
                  </div>
                  <div className="receipt-type">
                    <span className="receipt-badge">FEE RECEIPT</span>
                  </div>
                </div>

                {/* Receipt Info */}
                <div className="receipt-info">
                  <div className="receipt-number">
                    <span>Receipt No: RCP-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="receipt-date">
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="student-section">
                  <h3 className="section-title">Student Information</h3>
                  <div className="student-grid">
                    <div className="student-item">
                      <span className="label">Student Name</span>
                      <span className="value">{receipt.name}</span>
                    </div>
                    <div className="student-item">
                      <span className="label">Standard/Class</span>
                      <span className="value">{receipt.standard}</span>
                    </div>
                    <div className="student-item">
                      <span className="label">Payment Method</span>
                      <span className="value">{receipt.paymentMethod}</span>
                    </div>
                    <div className="student-item">
                      <span className="label">Payment Date</span>
                      <span className="value">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Table */}
                <div className="payment-section">
                  <h3 className="section-title">Payment Details</h3>
                  <div className="payment-table">
                    <div className="table-header">
                      <span>Description</span>
                      <span>Amount</span>
                    </div>
                    <div className="table-row">
                      <span>Fee Payment</span>
                      <span className="amount">₹{formData.amountPaid}</span>
                    </div>
                  </div>
                </div>

                {/* Fee Summary */}
                <div className="summary-section">
                  <h3 className="section-title">Fee Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Total Fees:</span>
                      <span className="summary-value">₹{receipt.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Fees Paid So Far:</span>
                      <span className="summary-value">₹{receipt.feesPaid.toLocaleString()}</span>
                    </div>
                    <div className="summary-item highlight">
                      <span className="summary-label">Remaining Balance:</span>
                      <span className="summary-value">₹{receipt.feesRemaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Thank You Section */}
                <div className="thank-you-section">
                  <div className="thank-you-message">
                    <span>🎉 Thank you for your payment!</span>
                  </div>
                  <div className="receipt-note">
                    <p>This receipt is valid for all official purposes. Please retain for your records.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="receipt-actions">
                  <button onClick={handlePrint} className="print-button">
                    🖨️ Print Receipt
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Fees;