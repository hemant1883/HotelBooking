import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { PlusCircle, Bed, MapPin, Trash2 } from 'lucide-react';

const ManagerDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchMyHotels(); }, []);

    const fetchMyHotels = async () => {
        try {
            const response = await api.get('/hotels/my-hotels');
            setHotels(response.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this hotel? All rooms will be removed.")) {
            try {
                await api.delete(`/hotels/${id}`);
                setHotels(hotels.filter(h => h.id !== id)); // Remove from UI
                alert("Hotel deleted successfully");
            } catch (error) {
                alert("Error deleting hotel");
            }
        }
    };

    if (loading) return <div className="text-center p-20">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Manager Dashboard</h1>
                <Link to="/manager/add-hotel" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                    <PlusCircle size={20} /> Add Property
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                        <div className="flex gap-6 items-center">
                            <img src={hotel.images?.[0] || 'https://via.placeholder.com/100'} className="w-24 h-24 object-cover rounded-xl" />
                            <div>
                                <h2 className="text-xl font-bold">{hotel.name}</h2>
                                <p className="text-gray-500 flex items-center gap-1"><MapPin size={14}/> {hotel.city}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {/* Manage Rooms Link */}
                            <Link to={`/manager/hotel/${hotel.id}/rooms`} className="bg-blue-50 text-blue-700 px-5 py-2 rounded-xl font-bold flex items-center gap-2">
                                <Bed size={18} /> Manage Rooms
                            </Link>
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(hotel.id)}
                                className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManagerDashboard;