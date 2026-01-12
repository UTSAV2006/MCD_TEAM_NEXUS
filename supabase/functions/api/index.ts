import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/api', '');
  
  console.log(`[API] ${req.method} ${path}`);
  
  // Create Supabase client with service role for database access
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  try {
    // =====================
    // LOGIN
    // =====================
    if (path === '/login' && req.method === 'POST') {
      const { employee_id, password } = await req.json();
      
      console.log(`[LOGIN] Attempting login for: ${employee_id}`);
      
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employee_id)
        .eq('password', password);
      
      if (error) {
        console.error('[LOGIN] Database error:', error);
        throw error;
      }
      
      if (!employees || employees.length === 0) {
        console.log('[LOGIN] Invalid credentials');
        return new Response(
          JSON.stringify({ error: "Invalid Employee ID or Password" }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const employee = employees[0];
      
      // Determine role based on ID prefix or role field
      let userRole = 'employee';
      if (employee_id.startsWith('ADM') || employee.role === 'Senior Engineer') {
        userRole = 'admin';
      } else if (employee_id.startsWith('HR') || employee.role === 'Inspector') {
        userRole = 'hr';
      }
      
      console.log(`[LOGIN] Success for ${employee_id}, role: ${userRole}`);
      
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
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // GET SINGLE EMPLOYEE
    // =====================
    const employeeMatch = path.match(/^\/employee\/(.+)$/);
    if (employeeMatch && req.method === 'GET') {
      const id = employeeMatch[1];
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        return new Response(
          JSON.stringify({ error: "Employee not found" }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // GET EMPLOYEE ATTENDANCE
    // =====================
    const attendanceMatch = path.match(/^\/employee-attendance\/(.+)$/);
    if (attendanceMatch && req.method === 'GET') {
      const id = attendanceMatch[1];
      
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', id)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // POST ATTENDANCE (Check-in)
    // =====================
    if (path === '/attendance' && req.method === 'POST') {
      const { employee_id } = await req.json();
      
      // Call the record_attendance function
      const { error } = await supabase.rpc('record_attendance', {
        p_employee_id: employee_id
      });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ message: "ATTENDANCE + PAYROLL UPDATED" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // GET TODAY'S ATTENDANCE
    // =====================
    if (path === '/attendance' && req.method === 'GET') {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('attendance')
        .select('employee_id, check_in, employees(name)')
        .eq('date', today)
        .order('check_in', { ascending: false });
      
      if (error) throw error;
      
      // Format response to match expected structure
      const formatted = (data || []).map((row: any) => ({
        name: row.employees?.name,
        check_in: row.check_in
      }));
      
      return new Response(
        JSON.stringify(formatted),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // GET LATEST PAYROLL
    // =====================
    const payrollMatch = path.match(/^\/payroll\/(.+)$/);
    if (payrollMatch && req.method === 'GET') {
      const id = payrollMatch[1];
      
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_id', id)
        .order('month', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // GET PAYROLL HISTORY
    // =====================
    const payrollHistoryMatch = path.match(/^\/payroll-history\/(.+)$/);
    if (payrollHistoryMatch && req.method === 'GET') {
      const id = payrollHistoryMatch[1];
      
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_id', id)
        .order('month', { ascending: false });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify(data || []),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // SEED EMPLOYEES (for initial setup)
    // =====================
    if (path === '/seed' && req.method === 'POST') {
      const names = ["Amit", "Rohit", "Neha", "Pooja", "Rakesh", "Sunita", "Manoj", "Priya", "Ankit", "Seema"];
      const roles = ["Sanitation Worker", "Clerk", "Junior Engineer", "Supervisor", "Data Operator"];
      const depts = ["Sanitation", "IT", "Water", "Road", "Admin"];
      const zones = ["Rohini", "Dwarka", "Karol Bagh", "Lajpat Nagar", "Shahdara"];
      
      const employees = [];
      for (let i = 1; i <= 50; i++) {
        employees.push({
          id: `MCD${2000 + i}`,
          name: names[Math.floor(Math.random() * names.length)],
          role: roles[Math.floor(Math.random() * roles.length)],
          department: depts[Math.floor(Math.random() * depts.length)],
          zone: zones[Math.floor(Math.random() * zones.length)],
          phone: "9" + Math.floor(100000000 + Math.random() * 900000000).toString(),
          email: `emp${i}@mcd.gov.in`,
          status: 'Active',
          password: '1234'
        });
      }
      
      const { error } = await supabase
        .from('employees')
        .upsert(employees, { onConflict: 'id' });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ message: "50 EMPLOYEES SEEDED" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // =====================
    // HEALTH CHECK
    // =====================
    if (path === '/health' || path === '' || path === '/') {
      return new Response(
        JSON.stringify({ status: 'ok', time: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Not found
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
