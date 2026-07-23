import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { X, Calendar, Users, Loader2 } from 'lucide-react';

const BookingModal = ({ room, onClose }) => {
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numOfGuests: 1
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault();

        // Basic frontend date check
        if (bookingData.checkOutDate <= bookingData.checkInDate) {
            alert("Check-out date must be after check-in date");
            return;
        }

        setIsSubmitting(true);
        try {
            const request = {
                roomId: room.id,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                numOfGuests: parseInt(bookingData.numOfGuests)
            };

            await api.post('/bookings', request);
            alert("Success! Your booking request has been sent to the manager.");
            onClose();
        } catch (error) {
            console.error("Booking Error:", error);

            // Handle error response correctly
            let errorMsg = "An unexpected error occurred.";
            if (error.response?.data) {
                errorMsg = typeof error.response.data === 'string'
                    ? error.response.data
                    : (error.response.data.message || JSON.stringify(error.response.data));
            }

            alert("Booking Failed: " + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Confirm Booking</h2>
                        <p className="text-blue-100 text-sm mt-1">{room.roomType} — ${room.pricePerNight}/night</p>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-blue-500 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleConfirm} className="p-8 space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Calendar size={16} className="text-blue-600" /> Check-In Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                onChange={e => setBookingData({...bookingData, checkInDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Calendar size={16} className="text-blue-600" /> Check-Out Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                onChange={e => setBookingData({...bookingData, checkOutDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                <Users size={16} className="text-blue-600" /> Number of Guests
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={room.capacity}
                                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={bookingData.numOfGuests}
                                onChange={e => setBookingData({...bookingData, numOfGuests: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Processing...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;