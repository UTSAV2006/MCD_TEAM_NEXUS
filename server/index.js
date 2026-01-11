import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ======================
   BASIC CHECK
====================== */
app.get("/", (req, res) => res.send("MCD HRMS Backend Running"));

app.get("/health", async (req, res) => {
  const { rows } = await db.query("SELECT NOW()");
  res.json(rows[0]);
});

/* ======================
   EMPLOYEES
====================== */
app.get("/init-employees", async (req, res) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      department TEXT,
      zone TEXT,
      phone TEXT,
      email TEXT,
      status TEXT,
      password TEXT DEFAULT '1234',
      avatar TEXT,
      address TEXT,
      joining_date DATE DEFAULT CURRENT_DATE
    );
  `);
  res.send("EMPLOYEE TABLE CREATED");
});

/* ======================
   LOGIN / AUTHENTICATION
====================== */
app.post("/api/login", async (req, res) => {
  const { employee_id, password } = req.body;
  
  try {
    const { rows } = await db.query(
      "SELECT * FROM employees WHERE id = $1 AND password = $2",
      [employee_id, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid Employee ID or Password" });
    }
    
    const employee = rows[0];
    
    // Determine role based on ID prefix or role field
    let userRole = 'employee';
    if (employee_id.startsWith('ADM') || employee.role === 'Senior Engineer') {
      userRole = 'admin';
    } else if (employee_id.startsWith('HR') || employee.role === 'Inspector') {
      userRole = 'hr';
    }
    
    res.json({
      success: true,
      employee: {
        ...employee,
        userRole
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/employee/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM employees WHERE id = $1",
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/employee-attendance/:id", async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM attendance 
      WHERE employee_id = $1 
      ORDER BY date DESC
      LIMIT 30
    `, [req.params.id]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/seed-employees", async (req, res) => {
  const names = ["Amit","Rohit","Neha","Pooja","Rakesh","Sunita","Manoj","Priya","Ankit","Seema"];
  const roles = ["Sanitation Worker","Clerk","Junior Engineer","Supervisor","Data Operator"];
  const depts = ["Sanitation","IT","Water","Road","Admin"];
  const zones = ["Rohini","Dwarka","Karol Bagh","Lajpat Nagar","Shahdara"];

  for (let i = 1; i <= 50; i++) {
    await db.query(
      `INSERT INTO employees VALUES ($1,$2,$3,$4,$5,$6,$7,'Active')
       ON CONFLICT (id) DO NOTHING`,
      [
        `MCD${2000+i}`,
        names[Math.floor(Math.random()*names.length)],
        roles[Math.floor(Math.random()*roles.length)],
        depts[Math.floor(Math.random()*depts.length)],
        zones[Math.floor(Math.random()*zones.length)],
        "9"+Math.floor(100000000+Math.random()*900000000),
        `emp${i}@mcd.gov.in`
      ]
    );
  }
  res.send("50 EMPLOYEES READY");
});

app.get("/api/employees", async (req,res)=>{
  const { rows } = await db.query("SELECT * FROM employees ORDER BY name");
  res.json(rows);
});

/* ======================
   ATTENDANCE
====================== */
app.get("/init-attendance", async (req,res)=>{
  await db.query(`
    CREATE TABLE IF NOT EXISTS attendance(
      id SERIAL PRIMARY KEY,
      employee_id TEXT,
      date DATE,
      check_in TIME
    );
  `);
  res.send("ATTENDANCE TABLE CREATED");
});

app.post("/api/attendance", async (req,res)=>{
  const { employee_id } = req.body;
  await db.query(
    "INSERT INTO attendance VALUES (DEFAULT,$1,CURRENT_DATE,CURRENT_TIME)",
    [employee_id]
  );

  // auto update payroll
  await db.query(`
    INSERT INTO payroll (employee_id, month, present_days, salary)
    VALUES ($1, to_char(CURRENT_DATE,'Mon-YYYY'), 1, 500)
    ON CONFLICT (employee_id, month)
    DO UPDATE SET
      present_days = payroll.present_days + 1,
      salary = (payroll.present_days + 1) * 500
  `, [employee_id]);

  res.send("ATTENDANCE + PAYROLL UPDATED");
});

app.get("/api/attendance", async (req,res)=>{
  const { rows } = await db.query(`
    SELECT e.name,a.check_in
    FROM attendance a JOIN employees e ON e.id=a.employee_id
    WHERE a.date=CURRENT_DATE
    ORDER BY a.check_in DESC
  `);
  res.json(rows);
});

/* ======================
   PAYROLL
====================== */
app.get("/init-payroll", async (req, res) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS payroll (
      employee_id TEXT,
      month TEXT,
      present_days INT DEFAULT 0,
      salary INT DEFAULT 0,
      PRIMARY KEY (employee_id, month)
    );
  `);
  res.send("PAYROLL TABLE READY");
});

app.get("/force-payroll/:id", async (req, res) => {
  await db.query(`
    INSERT INTO payroll (employee_id, month, present_days, salary)
    VALUES ($1, to_char(CURRENT_DATE,'Mon-YYYY'), 1, 500)
    ON CONFLICT (employee_id, month) DO NOTHING
  `, [req.params.id]);

  res.send("PAYROLL RECORD CREATED");
});

app.get("/api/payroll/:id", async (req, res) => {
  const { id } = req.params;

  const { rows } = await db.query(`
    SELECT * FROM payroll
    WHERE employee_id = $1
    ORDER BY month DESC
    LIMIT 1
  `, [id]);

  if (rows.length === 0) return res.json(null);

  res.json(rows[0]);
});

app.get("/api/payroll-history/:id", async (req, res) => {
  const { rows } = await db.query(`
    SELECT * FROM payroll
    WHERE employee_id = $1
    ORDER BY month DESC
  `, [req.params.id]);

  res.json(rows);
});

/* ====================== */
app.listen(5050, ()=>console.log("Backend running on http://localhost:5050"));