import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { 
  Users, BookOpen, Calendar, Award, LogOut, Search, Menu, X 
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = user ? [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <Users size={18} /> },
    ...(user.role === UserRole.MENTEE ? [{ id: 'mentors', label: 'Tìm Mentor', path: '/mentors', icon: <Search size={18} /> }] : []),
    ...(user.role === UserRole.MENTOR ? [{ id: 'my-schedule', label: 'Quản lý lịch dạy', path: '/my-schedule', icon: <Calendar size={18} /> }] : []),
    { id: 'schedule', label: 'Lịch đã đặt', path: '/schedule', icon: <BookOpen size={18} /> },
    { id: 'leaderboard', label: 'BXH Thiện Nguyện', path: '/leaderboard', icon: <Award size={18} /> },
  ] : [];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer">
            <Link to="/" className="text-2xl font-bold text-brand-600">HocTuThien</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path) 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {user && (
               <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                 <div className="text-right">
                   <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                   <p className="text-xs text-gray-500">{user.role === UserRole.MENTOR ? 'Mentor' : 'Mentee'}</p>
                 </div>
                 <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Đăng xuất">
                   <LogOut size={20} />
                 </button>
               </div>
            )}
            {!user && (
               <Link 
                to="/login"
                className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700"
               >
                 Đăng nhập
               </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};