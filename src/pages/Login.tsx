import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }: { onLogin: (role: string, name: string) => void }) => {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple Logic for Prototype
    if (id.startsWith('ADM')) onLogin('admin', 'Admin User');
    else if (id.startsWith('HR')) onLogin('hr', 'HR Manager');
    else onLogin('employee', 'Field Worker');}

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4">
      <div className="max-w-md w-full bg-background rounded-2xl shadow-2xl p-8 border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">MCD Workforce Portal</h1>
          <p className="text-muted-foreground">Enter your credentials to login</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full p-3 rounded-lg border bg-muted" placeholder="Employee ID (ADM01 or EMP01)" onChange={e => setId(e.target.value)} />
          <input className="w-full p-3 rounded-lg border bg-muted" type="password" placeholder="Passcode" onChange={e => setPin(e.target.value)} />
          <Button type="submit" className="w-full h-12 text-lg">Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;