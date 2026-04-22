import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { AcademicCapIcon, UserCircleIcon, ArrowRightOnRectangleIcon, VideoCameraIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-500 transition-colors';

  return (
    <nav className="fixed w-full z-50 glass top-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-200">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              Learn<span className="text-indigo-600">Platform</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {userInfo ? (
              <>
                <Link to="/catalog" className={`flex items-center space-x-1 ${isActive('/catalog')}`}>
                  <VideoCameraIcon className="h-5 w-5" />
                  <span>Catalog</span>
                </Link>
                {userInfo.role !== 'instructor' && (
                  <Link to="/my-courses" className={`flex items-center space-x-1 ${isActive('/my-courses')}`}>
                    <BookOpenIcon className="h-5 w-5" />
                    <span>My Courses</span>
                  </Link>
                )}
                {userInfo.role === 'instructor' && (
                  <Link to="/instructor" className={`flex items-center space-x-1 ${isActive('/instructor')}`}>
                    <UserCircleIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4 border-l border-slate-200 pl-6 ml-2">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-800">{userInfo.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{userInfo.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Sign In</Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
