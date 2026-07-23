import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Check, X, Clock, User } from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/manager');
            setBookings(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status?status=${status}`);
            // REFRESH: This will remove 'CANCELLED' items if the backend filters them,
            // or we filter them here in the frontend:
            fetchBookings();
        } catch (err) { alert("Error updating status"); }
    };

    if (loading) return <div className="p-20 text-center">Loading Guest Reservations...</div>;

    // Filter out CANCELLED bookings so they disappear from the "active" list
    const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Clock className="text-blue-600" /> Guest Reservations
            </h1>

            {activeBookings.length === 0 ? (
                <div className="bg-gray-50 p-20 text-center rounded-2xl border-2 border-dashed">
                    <p className="text-gray-500 text-lg">No active guest reservations found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeBookings.map((b) => {
                        const isPast = b.checkOutDate < today;
                        const isPending = b.status === 'PENDING';

                        return (
                            <div key={b.id} className={`p-6 rounded-2xl border transition shadow-sm flex flex-col md:flex-row justify-between items-center ${isPast ? 'bg-gray-100 opacity-50' : 'bg-white'}`}>
                                <div className="flex gap-5 items-center">
                                    <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-gray-800">{b.hotelName}</h3>
                                            {isPast && <span className="bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">Past Stay (History)</span>}
                                        </div>
                                        <p className="text-blue-600 font-semibold">{b.roomType} — {b.numOfGuests} Guests</p>
                                        <p className="text-gray-400 text-sm mt-1">{b.checkInDate} to {b.checkOutDate}</p>
                                    </div>
                                </div>

                                <div className="text-right mt-4 md:mt-0 flex flex-col items-end">
                                    <p className="text-2xl font-black text-gray-900 mb-3">${b.totalPrice}</p>

                                    {isPending ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-green-700 font-bold transition"
                                            >
                                                <Check size={18} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-red-100 font-bold transition"
                                            >
                                                <X size={18} /> Deny
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                                            <Check size={18} /> Booked
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageBookings;