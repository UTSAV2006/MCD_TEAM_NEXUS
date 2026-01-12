-- HRMS tables for Lovable Cloud backend

CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  department TEXT,
  zone TEXT,
  phone TEXT,
  email TEXT,
  status TEXT,
  password TEXT NOT NULL DEFAULT '1234',
  avatar TEXT,
  address TEXT,
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id BIGSERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIME NOT NULL DEFAULT CURRENT_TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll (
  employee_id TEXT NOT NULL,
  month TEXT NOT NULL,
  present_days INT NOT NULL DEFAULT 0,
  salary INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (employee_id, month)
);

-- Relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_employee_id_fkey'
  ) THEN
    ALTER TABLE public.attendance
    ADD CONSTRAINT attendance_employee_id_fkey
    FOREIGN KEY (employee_id) REFERENCES public.employees(id)
    ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payroll_employee_id_fkey'
  ) THEN
    ALTER TABLE public.payroll
    ADD CONSTRAINT payroll_employee_id_fkey
    FOREIGN KEY (employee_id) REFERENCES public.employees(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- RLS (block direct client access; edge functions use service role)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- updated_at trigger for employees
DROP TRIGGER IF EXISTS update_employees_updated_at ON public.employees;
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Atomic attendance+payroll update
CREATE OR REPLACE FUNCTION public.record_attendance(p_employee_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_month TEXT;
BEGIN
  v_month := to_char(CURRENT_DATE,'Mon-YYYY');

  INSERT INTO public.attendance (employee_id)
  VALUES (p_employee_id);

  INSERT INTO public.payroll (employee_id, month, present_days, salary)
  VALUES (p_employee_id, v_month, 1, 500)
  ON CONFLICT (employee_id, month)
  DO UPDATE SET
    present_days = public.payroll.present_days + 1,
    salary = (public.payroll.present_days + 1) * 500;
END;
$$;