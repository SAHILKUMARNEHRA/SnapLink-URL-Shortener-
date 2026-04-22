import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-slate-900">SnapLink</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="text-slate-600 hover:text-primary font-medium">Admin</Link>
                )}
                <Link to="/dashboard" className="text-slate-600 hover:text-primary font-medium">Dashboard</Link>
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary font-medium">Login</Link>
                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
