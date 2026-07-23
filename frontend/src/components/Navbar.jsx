import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav className="bg-[#003580] text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    <div className="bg-white p-1 rounded-lg"><Hotel className="text-[#003580]" size={24} /></div>
                    StayEase
                </Link>

                <div className="flex gap-8 items-center font-medium">
                    <Link to="/" className="hover:text-yellow-400 transition">Home</Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.role === 'ROLE_MANAGER' && (
                                <>
                                <Link to="/manager/dashboard" className="flex items-center gap-1 hover:text-yellow-400 transition">
                                    <LayoutDashboard size={18} /> Manager Panel
                                </Link>
                                <Link to="/manager/bookings" className="bg-yellow-400 text-[#003580] px-3 py-1 rounded font-bold text-sm hover:bg-yellow-500 transition">
                                Guest Reservations
                                </Link>
                                </>
                            )}
                            <Link to="/my-bookings" className="hover:text-yellow-400">My Bookings</Link>

                            <div className="flex items-center gap-3 bg-blue-800/50 px-4 py-2 rounded-full border border-blue-400/30 text-sm">
                                <User size={16} className="text-yellow-400" />
                                <span>Hi, {user.firstName}</span>
                            </div>

                            <button onClick={() => { logout(); navigate('/login'); }} className="text-red-300 hover:text-white transition">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="hover:text-yellow-400 transition">Sign in</Link>
                            <Link to="/register" className="bg-white text-[#003580] px-5 py-2 rounded-md font-bold hover:bg-gray-100 transition shadow-lg">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;