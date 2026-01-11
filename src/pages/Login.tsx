import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  phone: string;
  email: string;
  status: string;
  userRole: 'admin' | 'employee' | 'hr';
}

interface LoginProps {
  onLogin: (employee: LoginEmployee) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const Login = ({ onLogin }: LoginProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_id: employeeId.toUpperCase(), 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.employee);
    } catch (err: any) {
      setError(err.message || 'Invalid Employee ID or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex p-4 rounded-full bg-primary/10 mb-4 border border-primary/20"
          >
            <ShieldCheck className="h-12 w-12 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">MCD Workforce Portal</h1>
          <p className="text-muted-foreground mt-2">Municipal Corporation of Delhi</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-2xl p-8 border border-border backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Employee Login</h2>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="e.g., MCD2001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-12"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Use ADM prefix for Admin, HR prefix for HR role
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Default password: 1234
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Municipal Corporation of Delhi. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Having trouble logging in? Contact HR Department
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
