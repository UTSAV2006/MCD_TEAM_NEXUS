import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import pkg from "pg"

dotenv.config()
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// =======================
// BASIC CHECK
// =======================
app.get("/", (req, res) => res.send("MCD HRMS Backend Running"))

app.get("/health", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT NOW()")
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).send("DB ERROR")
  }
})

// =======================
// EMPLOYEES TABLE
// =======================
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
      status TEXT
    );
  `)
  res.send("EMPLOYEE TABLE CREATED")
})

// =======================
// SEED 50 EMPLOYEES (SAFE)
// =======================
app.get("/seed-employees", async (req, res) => {
  try {
    const names = ["Amit","Rohit","Neha","Pooja","Rakesh","Sunita","Manoj","Priya","Ankit","Seema"]
    const roles = ["Sanitation Worker","Clerk","Junior Engineer","Supervisor","Data Operator"]
    const depts = ["Sanitation","IT","Water","Road","Admin"]
    const zones = ["Rohini","Dwarka","Karol Bagh","Lajpat Nagar","Shahdara"]

    for (let i = 1; i <= 50; i++) {
      await db.query(
        `INSERT INTO employees (id,name,role,department,zone,phone,email,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [
          `MCD${2000 + i}`,
          names[Math.floor(Math.random() * names.length)],
          roles[Math.floor(Math.random() * roles.length)],
          depts[Math.floor(Math.random() * depts.length)],
          zones[Math.floor(Math.random() * zones.length)],
          "9" + Math.floor(100000000 + Math.random() * 900000000),
          `emp${i}@mcd.gov.in`,
          "Active"
        ]
      )
    }

    res.send("50 EMPLOYEES INSERTED (SAFE)")
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

// =======================
// GET EMPLOYEES
// =======================
app.get("/api/employees", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM employees ORDER BY name")
  res.json(rows)
})

// =======================
// ATTENDANCE TABLE
// =======================
app.get("/init-attendance", async (req, res) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      employee_id TEXT,
      date DATE,
      check_in TIME
    );
  `)
  res.send("ATTENDANCE TABLE CREATED")
})

// =======================
// MARK ATTENDANCE
// =======================
app.post("/api/attendance", async (req, res) => {
  const { employee_id } = req.body

  await db.query(
    "INSERT INTO attendance (employee_id, date, check_in) VALUES ($1, CURRENT_DATE, CURRENT_TIME)",
    [employee_id]
  )

  res.send("ATTENDANCE MARKED")
})

// =======================
// TODAY'S ATTENDANCE
// =======================
app.get("/api/attendance", async (req, res) => {
  const { rows } = await db.query(`
    SELECT a.employee_id, e.name, a.check_in
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    WHERE a.date = CURRENT_DATE
    ORDER BY a.check_in DESC
  `)
  res.json(rows)
})

app.post("/api/attendance/mark", async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) return res.status(400).send("Employee ID required");

  await db.query(
    "INSERT INTO attendance (employee_id, date, check_in) VALUES ($1, CURRENT_DATE, CURRENT_TIME)",
    [employee_id]
  );

  res.send("ATTENDANCE SAVED");
});

app.get("/repair-attendance", async (req, res) => {
  await db.query("DROP TABLE IF EXISTS attendance;");
  await db.query(`
    CREATE TABLE attendance (
      id SERIAL PRIMARY KEY,
      employee_id TEXT,
      date DATE,
      check_in TIME
    );
  `);
  res.send("ATTENDANCE TABLE REPAIRED");
});

// =======================
app.listen(5050, () => console.log("Backend running on http://localhost:5050"))