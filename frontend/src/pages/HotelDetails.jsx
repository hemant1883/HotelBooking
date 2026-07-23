import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import BookingModal from '../components/BookingModal'; // We will create this next

const HotelDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Get logged in user info
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const hRes = await api.get(`/hotels/${id}`);
            const rRes = await api.get(`/rooms/hotel/${id}`);
            setHotel(hRes.data);
            setRooms(rRes.data);
        };
        fetchData();
    }, [id]);

    if (!hotel) return <div className="p-10">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <div className="lg:col-span-2">
                    <img src={hotel.images?.[0]} className="w-full h-96 object-cover rounded-2xl" />
                    <p className="mt-4 text-gray-700">{hotel.description}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg h-fit border">
                    <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
                    {rooms.map(room => (
                        <div key={room.id} className="border-b py-4 last:border-0 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{room.roomType}</p>
                                <p className="text-blue-600 font-bold">${room.pricePerNight}/night</p>
                            </div>

                            {/* HIDE BOOK BUTTON FOR MANAGERS */}
                            {user?.role === 'ROLE_USER' && (
                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
                                >
                                    Book Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Show Booking Modal if a room is selected */}
            {selectedRoom && (
                <BookingModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </div>
    );
};
export default HotelDetails;