import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentInfo.css";

export default function StudentInfo() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student;

  if (!student) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>No Student Data Found</h2>
          <p>The student information could not be loaded. Please try again.</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalPaid = student.feePayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const remainingBalance = (student.totalFees || 0) - totalPaid;

  return (
    <div className="student-info-container">
      <div className="student-info-wrapper">
        {/* Header Section */}
        <div className="student-header">
          <h1>{student.name}</h1>
          <p>Class: {student.standard}</p>
          <p>Email: {student.email}</p>
        </div>

        {/* Fee Summary Cards */}
        <div className="fee-summary-grid">
          <div className="summary-card total-fees">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Fees</h3>
              <p className="amount">₹{(student.totalFees || 0).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="summary-card paid-fees">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Amount Paid</h3>
              <p className="amount">₹{totalPaid.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="summary-card remaining-fees">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <h3>Remaining Balance</h3>
              <p className="amount">₹{remainingBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="payment-history-section">
          <div className="section-header">
            <h2>Payment History</h2>
            <div className="payment-count">
              {student.feePayments?.length || 0} Payment{(student.feePayments?.length || 0) !== 1 ? 's' : ''}
            </div>
          </div>

          {student.feePayments && student.feePayments.length > 0 ? (
            <div className="payments-container">
              <div className="payments-table-wrapper">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Payment #</th>
                      <th>Amount Paid</th>
                      <th>Payment Method</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.feePayments.map((entry, idx) => (
                      <tr key={idx} className="payment-row">
                        <td>
                          <span className="payment-number">#{idx + 1}</span>
                        </td>
                        <td>
                          <span className="payment-amount">₹{entry.amount?.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className={`payment-method ${entry.paymentMode?.toLowerCase()}`}>
                            {entry.paymentMode === 'UPI'}
                            {entry.paymentMode === 'Cash'}
                            {entry.paymentMode === 'Bank Transfer'}
                            {entry.paymentMode || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="payment-date">
                            {new Date(entry.paymentDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td>
                          <span className="status-badge completed">✓ Completed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-payments">
              <div className="no-payments-icon">📄</div>
              <h3>No Payments Made Yet</h3>
              <p>This student hasn't made any fee payments yet.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/fees', { state: { student } })}>
            Make Payment
          </button>
          <button className="action-btn secondary" onClick={() => navigate(-1)}>
            ← Back to Students
          </button>
        </div>
      </div>
    </div>
  );
}