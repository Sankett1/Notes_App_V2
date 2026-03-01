import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

function App() {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse">✏️</div>
          <p className="text-slate-500 font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {!isLoggedIn() && <Hero />}
        {isLoggedIn() && isAdmin() && <AdminDashboard />}
        {isLoggedIn() && !isAdmin() && <UserDashboard />}
      </div>
    </>
  );
}

export default App;
