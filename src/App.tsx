import { useState } from 'react';
import Index from './pages/Index';
import Login from './pages/Login';


// User type definition
interface User {
  role: 'admin' | 'employee';
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Login handle karne ka function
  const handleLogin = (role: 'admin' | 'employee', name: string) => {
    setUser({ role, name });
  };

  // Logout handle karne ka function
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        // Agar login nahi hai toh Login Page dikhao
        <Login onLogin={handleLogin} />
      ) : (
        // Agar login hai toh Dashboard (Index) dikhao aur user data pass karo
        <Index user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
