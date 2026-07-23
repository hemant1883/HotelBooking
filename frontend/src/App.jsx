import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelListing from './pages/HotelListing';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';
import ManageBookings from './pages/manager/ManageBookings';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AddHotel from './pages/manager/AddHotel';
import ManageRooms from './pages/manager/ManageRooms';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/hotels" element={<HotelListing />} />
                    <Route path="/hotel/:id" element={<HotelDetails />} />

                    <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

                    <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
                    <Route path="/manager/bookings" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><ManageBookings /></ProtectedRoute>} />
                    <Route path="/manager/add-hotel" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><AddHotel /></ProtectedRoute>} />
                    <Route path="/manager/hotel/:hotelId/rooms" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><ManageRooms /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;