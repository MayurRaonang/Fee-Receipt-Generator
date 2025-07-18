const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const StudentFee = require("../models/StudentFee");
const authenticateToken = require("../middleware/auth");
const verificationSecret = process.env.JWT_SECRET;
const PDFDocument = require("pdfkit");
const streamBuffers = require("stream-buffers");

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/register", async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const newUser = new User({ username, password, email, role, verified: false });
    await newUser.save();

    // Create verification token
    const token = jwt.sign({ email }, verificationSecret, { expiresIn: "1h" });

    // Email with verification link
    const verificationLink = `http://localhost:5000/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Career Compass account",
      html: `<p>Hi ${username},</p><p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">${verificationLink}</a><p>This link expires in 1 hour.</p>`,
    });

    res.status(201).json({ message: "Registration successful! Please verify your email." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;
  try {
    const { email } = jwt.verify(token, verificationSecret);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    if (user.verified) {
      return res.send("Email already verified. You can now login.");
    }

    user.verified = true;
    await user.save();

    res.send("Email verified successfully! You can now login.");
  } catch (err) {
    console.error("Verification error:", err.message);
    res.status(400).send("Invalid or expired verification link");
  }
});


// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("Login attempt for user:", username);
  try {
    const user = await User.findOne({ username });
    uid = user._id; // Store user ID for later use
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    if (!user.verified) {
      return res.status(403).json({ error: "Please verify your email first." });
    }

    // Include _id for tracking the user
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to validate token
router.get("/validate-token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(403).json({ valid: false });
  }
});

router.post("/fees", authenticateToken, async (req, res) => {
  const { name, standard, amountPaid, email, paymentMethod } = req.body;

  try {
    // Find student by name AND owner (user-specific)
    let student = await StudentFee.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      owner: req.user._id, 
      standard, 
      email 
    });
  
    if (!student) {
      return res.status(404).json({ error: "Student not found. Please register the student first." });
    }

    // Update payment details
    student.feesPaid += parseFloat(amountPaid);
    student.paymentMode = paymentMethod;

    await student.save();

    // Generate professional PDF receipt
    const doc = new PDFDocument({ margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();
    doc.pipe(bufferStream);

    // Header section with logo placeholder
    doc.rect(50, 50, 495, 120).fillAndStroke('#f8f9fa', '#dee2e6');
    
    // Logo placeholder (you can replace this with actual logo)
    doc.image('assets/logo.png', 70, 70, { width: 80, height: 80 });

    
    // Institute header
    doc.fillColor('#2c3e50').fontSize(24).font('Helvetica-Bold')
       .text('Career Compass Institute', 170, 75);
    
    doc.fillColor('#6c757d').fontSize(12).font('Helvetica')
       .text('Excellence in Education • Shaping Future Leaders', 170, 100);
    
    doc.fillColor('#495057').fontSize(10)
       .text('Address: Your Institute Address Here', 170, 120)
       .text('Phone: +91 XXXXX XXXXX | Email: info@careercompass.edu', 170, 135);

    // Receipt title
    doc.fillColor('#ffffff').rect(50, 190, 495, 40).fillAndStroke('#007bff', '#0056b3');
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
       .text('FEE PAYMENT RECEIPT', 50, 205, { align: 'center', width: 495 });

    // Receipt details section
    const receiptNumber = `RCP-${Date.now()}`;
    const paymentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.fillColor('#343a40').fontSize(10).font('Helvetica')
       .text(`Receipt No: ${receiptNumber}`, 400, 250)
       .text(`Date: ${paymentDate}`, 400, 265);

    // Student information section
    doc.fillColor('#495057').fontSize(14).font('Helvetica-Bold')
       .text('Student Information', 50, 300);
    
    doc.rect(50, 320, 495, 1).fillAndStroke('#dee2e6', '#dee2e6');

    const studentInfo = [
      ['Student Name:', student.name],
      ['Standard/Class:', student.standard],
      ['Email Address:', student.email],
      ['Student ID:', student._id.toString().slice(-8).toUpperCase()]
    ];

    let yPos = 340;
    studentInfo.forEach(([label, value]) => {
      doc.fillColor('#6c757d').fontSize(11).font('Helvetica-Bold')
         .text(label, 50, yPos, { width: 120 });
      doc.fillColor('#343a40').fontSize(11).font('Helvetica')
         .text(value, 180, yPos);
      yPos += 20;
    });

    // Payment details section
    doc.fillColor('#495057').fontSize(14).font('Helvetica-Bold')
       .text('Payment Details', 50, yPos + 20);
    
    doc.rect(50, yPos + 40, 495, 1).fillAndStroke('#dee2e6', '#dee2e6');

    // Payment table header
    yPos += 60;
    doc.fillColor('#ffffff').rect(50, yPos, 495, 25).fillAndStroke('#6c757d', '#495057');
    doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold')
       .text('Description', 60, yPos + 7)
       .text('Amount (Rs.)', 400, yPos + 7);

    // Payment table content
    yPos += 25;
    doc.fillColor('#f8f9fa').rect(50, yPos, 495, 25).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fillColor('#343a40').fontSize(11).font('Helvetica')
       .text('Fee Payment', 60, yPos + 7)
       .text(`Rs. ${parseFloat(amountPaid).toFixed(2)}`, 400, yPos + 7);

    // Payment summary
    yPos += 40;
    const remainingAmount = (student.totalFees - student.feesPaid).toFixed(2);
    const summaryItems = [
      ['Total Fees:', `Rs. ${student.totalFees.toFixed(2)}`],
      ['Fees Paid So Far:', `Rs. ${student.feesPaid.toFixed(2)}`],
      ['Remaining Balance:', `Rs. ${remainingAmount}`]
    ];

    summaryItems.forEach(([label, value], index) => {
      const bgColor = index === 2 ? '#e3f2fd' : '#ffffff';
      const textColor = index === 2 ? '#1976d2' : '#343a40';
      const fontWeight = index === 2 ? 'Helvetica-Bold' : 'Helvetica';
      
      doc.fillColor(bgColor).rect(300, yPos, 245, 20).fillAndStroke(bgColor, '#dee2e6');
      doc.fillColor(textColor).fontSize(11).font(fontWeight)
         .text(label, 310, yPos + 5)
         .text(value, 450, yPos + 5);
      yPos += 20;
    });

    // Payment method
    yPos += 15;
    doc.fillColor('#495057').fontSize(11).font('Helvetica-Bold')
       .text('Payment Method:', 50, yPos);
    doc.fillColor('#343a40').fontSize(11).font('Helvetica')
       .text(paymentMethod, 150, yPos);

    // Footer section - compact
    yPos += 40;
    doc.fillColor('#28a745').rect(50, yPos, 495, 30).fillAndStroke('#28a745', '#1e7e34');
    doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold')
       .text('Thank you for your payment!', 50, yPos + 9, { align: 'center', width: 495 });

    // Compact footer with signature
    yPos += 45;
    doc.fillColor('#6c757d').fontSize(9).font('Helvetica')
       .text('• This receipt is valid for official purposes. • Please retain for your records.', 50, yPos);
    
    doc.fillColor('#495057').fontSize(9).font('Helvetica-Bold')
       .text('Authorized Signature', 400, yPos);
    doc.rect(400, yPos + 10, 100, 1).fillAndStroke('#dee2e6', '#dee2e6');

    doc.end();

    bufferStream.on("finish", async () => {
      const pdfBuffer = bufferStream.getContents();

      // Professional email content
      const mailOptions = {
        from: `"Career Compass Institute" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: `Fee Receipt - Payment Confirmation | Career Compass Institute`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Career Compass Institute</h1>
              <p style="color: #e3f2fd; margin: 5px 0 0 0; font-size: 14px;">Excellence in Education</p>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; padding: 30px; margin: 20px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Dear ${student.name},</h2>
              
              <p style="color: #495057; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your recent fee payment. We have successfully processed your payment and your account has been updated.
              </p>
              
              <!-- Payment Summary Box -->
              <div style="background: #e3f2fd; border-left: 4px solid #007bff; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">Payment Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #495057;"><strong>Amount Paid:</strong></td>
                    <td style="padding: 8px 0; color: #28a745; font-weight: bold;">Rs. ${parseFloat(amountPaid).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #495057;"><strong>Payment Method:</strong></td>
                    <td style="padding: 8px 0; color: #495057;">${paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #495057;"><strong>Payment Date:</strong></td>
                    <td style="padding: 8px 0; color: #495057;">${paymentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #495057;"><strong>Receipt Number:</strong></td>
                    <td style="padding: 8px 0; color: #495057;">${receiptNumber}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Fee Status -->
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #2c3e50; margin-top: 0;">Fee Status</h4>
                <p style="color: #495057; margin: 5px 0;">
                  <strong>Total Fees:</strong> Rs. ${student.totalFees.toFixed(2)} | 
                  <strong>Paid:</strong> Rs. ${student.feesPaid.toFixed(2)} | 
                  <strong>Remaining:</strong> Rs. ${(student.totalFees - student.feesPaid).toFixed(2)}
                </p>
              </div>
              
              <p style="color: #495057; line-height: 1.6;">
                Please find the detailed receipt attached to this email. Keep this receipt for your records as it serves as proof of payment.
              </p>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #155724; margin: 0;">
                  <strong>📧 Need Help?</strong> If you have any questions regarding your payment or need assistance, 
                  please contact our accounts department at <a href="mailto:accounts@careercompass.edu" style="color: #007bff;">accounts@careercompass.edu</a> 
                  or call us at +91 XXXXX XXXXX.
                </p>
              </div>
              
              <p style="color: #495057; line-height: 1.6;">
                Thank you for choosing Career Compass Institute for your educational journey. We appreciate your trust in us.
              </p>
              
              <div style="margin-top: 30px;">
                <p style="color: #495057; margin: 0;">Best regards,</p>
                <p style="color: #007bff; font-weight: bold; margin: 5px 0;">Accounts Department</p>
                <p style="color: #6c757d; margin: 0; font-size: 14px;">Career Compass Institute</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #2c3e50; color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Career Compass Institute. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Address: Your Institute Address Here | Phone: +91 XXXXX XXXXX</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Fee_Receipt_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Fee recorded successfully and professional receipt emailed",
        receiptNumber: receiptNumber,
        updatedStudent: {
          name: student.name,
          standard: student.standard,
          totalFees: student.totalFees,
          feesPaid: student.feesPaid,
          feesRemaining: student.totalFees - student.feesPaid,
          paymentMethod: paymentMethod,
          paymentDate: paymentDate
        }
      });
    });
  } catch (error) {
    console.error("Fee processing error:", error);
    res.status(500).json({ error: "Fee processing failed. Please try again." });
  }
});

router.get("/students", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching students for user:", req.user._id);
    const students = await StudentFee.find({ owner: req.user._id });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});
let uid;
router.post("/students", authenticateToken, async (req, res) => {
  const { name, standard, email, totalFees } = req.body;
  uid = req.user._id;
  if (!name || !standard || !email || !totalFees) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("Creating student for user:", req.user);

    const newStudent = new StudentFee({
      name,
      standard,
      email,
      totalFees: Number(totalFees),
      feesPaid: 0,
      paymentMode: "Pending",
      owner: req.user._id,
    });

    console.log("Saving student:", newStudent);

    await newStudent.save();

    console.log("Student saved!");

    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error creating student:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/dashboard-stats", async (req, res) => {
  try {
    const userId = uid;
    console.log("Fetching dashboard stats for user:", userId);

    const students = await StudentFee.find({ owner: userId });

    const totalStudents = students.length;
    const totalRevenue = students.reduce((sum, student) => sum + student.feesPaid, 0);
    const fullyPaid = students.filter(student => student.feesPaid === student.totalFees).length;
    const remaining = totalStudents - fullyPaid;

    res.json({
      totalStudents,
      totalRevenue,
      fullyPaid,
      remaining
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/monthly-growth", async (req, res) => {
  try {
    // Example: count documents grouped by month (mock logic)
    const result = await StudentFee.aggregate([
      {
        $match: { owner: uid } // Filter by owner
      },
      {
        $group: {
          _id: { $month: "$dateOfAdmission" }, // assuming paymentDate field exists
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Convert numeric months to string names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = result.map(item => ({
      name: monthNames[item._id - 1],
      students: item.count
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

router.get("/monthly-revenue", async (req, res) => {
  try {
    const result = await StudentFee.aggregate([
      {
        $match: { owner: uid } // Filter by owner
      },
      {
        $group: {
          _id: { $month: "$dateOfAdmission" },
          revenue: { $sum: "$feesPaid" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // Map month numbers to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = result.map(item => ({
      month: monthNames[item._id - 1],
      revenue: item.revenue
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
});

module.exports = router;