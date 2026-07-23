import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To read the URL ?role=manager

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // Default
    });

    // EFFECT: Check if "role=manager" is in the URL and update state
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roleParam = queryParams.get('role');

        if (roleParam === 'manager') {
            setFormData(prev => ({ ...prev, role: 'ROLE_MANAGER' }));
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Include lastName logic if your DTO/Backend strictly requires it
            const registrationData = {
                ...formData,
                lastName: formData.lastName || 'User' // Fallback if field is hidden
            };

            await api.post('/auth/register', registrationData);
            alert("Registration Successful! Please login.");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Registration Failed: " + (error.response?.data?.message || "Error"));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-2 text-center text-primary">Create Account</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    {formData.role === 'ROLE_MANAGER'
                        ? "Register to start listing your properties"
                        : "Join us to find your perfect stay"}
                </p>

                <div className="space-y-4">
                    <input
                        type="text" placeholder="First Name" className="w-full p-2 border rounded"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} required
                    />

                    <input
                        type="email" placeholder="Email" className="w-full p-2 border rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required
                    />

                    <input
                        type="password" placeholder="Password" className="w-full p-2 border rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required
                    />

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account Type</label>
                        <select
                            className="w-full p-2 border rounded bg-gray-50 font-medium"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="ROLE_USER">Traveler (Guest)</option>
                            <option value="ROLE_MANAGER">Hotel Manager</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-6 hover:bg-blue-700 transition font-bold">
                    Register
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;