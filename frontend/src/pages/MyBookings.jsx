import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { CalendarCheck, Info } from 'lucide-react'; // Added icons for better UI

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // This fetches bookings made BY THE LOGGED-IN USER
                const response = await api.get('/bookings/my-bookings');
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching personal bookings:", error);
                // Handle error for the user, e.g., show a message
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // PENDING
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <CalendarCheck className="text-blue-600" /> My Booking History
            </h1>

            {bookings.length === 0 ? (
                <div className="bg-white p-16 text-center rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
                    <a href="/hotels" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
                        Find a hotel to book
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center gap-4 hover:shadow-md transition">
                            <div className="flex gap-4 items-center">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <Info className="text-blue-600" size={24} /> {/* Generic icon for booking */}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{booking.hotelName}</h2>
                                    <p className="text-gray-500 font-medium">{booking.roomType}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                        <span>Check-in: <strong>{booking.checkInDate}</strong></span>
                                        <span>Check-out: <strong>{booking.checkOutDate}</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-3">
                                <p className="text-2xl font-black text-gray-900">${booking.totalPrice}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;