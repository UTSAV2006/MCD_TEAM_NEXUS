import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize database connection
const pool = new Pool(Deno.env.get("DATABASE_URL")!, 3, true);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/api', '');
  
  console.log(`[API] ${req.method} ${path}`);
  
  try {
    const connection = await pool.connect();
    
    try {
      // =====================
      // LOGIN
      // =====================
      if (path === '/login' && req.method === 'POST') {
        const { employee_id, password } = await req.json();
        
        const result = await connection.queryObject<any>(
          "SELECT * FROM employees WHERE id = $1 AND password = $2",
          [employee_id, password]
        );
        
        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify({ error: "Invalid Employee ID or Password" }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const employee = result.rows[0];
        
        // Determine role based on ID prefix or role field
        let userRole = 'employee';
        if (employee_id.startsWith('ADM') || employee.role === 'Senior Engineer') {
          userRole = 'admin';
        } else if (employee_id.startsWith('HR') || employee.role === 'Inspector') {
          userRole = 'hr';
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            employee: { ...employee, userRole }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET ALL EMPLOYEES
      // =====================
      if (path === '/employees' && req.method === 'GET') {
        const result = await connection.queryObject<any>(
          "SELECT * FROM employees ORDER BY name"
        );
        
        return new Response(
          JSON.stringify(result.rows),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET SINGLE EMPLOYEE
      // =====================
      const employeeMatch = path.match(/^\/employee\/(.+)$/);
      if (employeeMatch && req.method === 'GET') {
        const id = employeeMatch[1];
        
        const result = await connection.queryObject<any>(
          "SELECT * FROM employees WHERE id = $1",
          [id]
        );
        
        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify({ error: "Employee not found" }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify(result.rows[0]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET EMPLOYEE ATTENDANCE
      // =====================
      const attendanceMatch = path.match(/^\/employee-attendance\/(.+)$/);
      if (attendanceMatch && req.method === 'GET') {
        const id = attendanceMatch[1];
        
        const result = await connection.queryObject<any>(`
          SELECT * FROM attendance 
          WHERE employee_id = $1 
          ORDER BY date DESC
          LIMIT 30
        `, [id]);
        
        return new Response(
          JSON.stringify(result.rows),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // POST ATTENDANCE (Check-in)
      // =====================
      if (path === '/attendance' && req.method === 'POST') {
        const { employee_id } = await req.json();
        
        await connection.queryObject(
          "INSERT INTO attendance VALUES (DEFAULT, $1, CURRENT_DATE, CURRENT_TIME)",
          [employee_id]
        );
        
        // Auto update payroll
        await connection.queryObject(`
          INSERT INTO payroll (employee_id, month, present_days, salary)
          VALUES ($1, to_char(CURRENT_DATE,'Mon-YYYY'), 1, 500)
          ON CONFLICT (employee_id, month)
          DO UPDATE SET
            present_days = payroll.present_days + 1,
            salary = (payroll.present_days + 1) * 500
        `, [employee_id]);
        
        return new Response(
          JSON.stringify({ message: "ATTENDANCE + PAYROLL UPDATED" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET TODAY'S ATTENDANCE
      // =====================
      if (path === '/attendance' && req.method === 'GET') {
        const result = await connection.queryObject<any>(`
          SELECT e.name, a.check_in
          FROM attendance a JOIN employees e ON e.id = a.employee_id
          WHERE a.date = CURRENT_DATE
          ORDER BY a.check_in DESC
        `);
        
        return new Response(
          JSON.stringify(result.rows),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET LATEST PAYROLL
      // =====================
      const payrollMatch = path.match(/^\/payroll\/(.+)$/);
      if (payrollMatch && req.method === 'GET') {
        const id = payrollMatch[1];
        
        const result = await connection.queryObject<any>(`
          SELECT * FROM payroll
          WHERE employee_id = $1
          ORDER BY month DESC
          LIMIT 1
        `, [id]);
        
        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify(null),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify(result.rows[0]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // GET PAYROLL HISTORY
      // =====================
      const payrollHistoryMatch = path.match(/^\/payroll-history\/(.+)$/);
      if (payrollHistoryMatch && req.method === 'GET') {
        const id = payrollHistoryMatch[1];
        
        const result = await connection.queryObject<any>(`
          SELECT * FROM payroll
          WHERE employee_id = $1
          ORDER BY month DESC
        `, [id]);
        
        return new Response(
          JSON.stringify(result.rows),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // =====================
      // HEALTH CHECK
      // =====================
      if (path === '/health' || path === '' || path === '/') {
        const result = await connection.queryObject("SELECT NOW()");
        return new Response(
          JSON.stringify({ status: 'ok', time: result.rows[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Not found
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } finally {
      connection.release();
    }
    
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
