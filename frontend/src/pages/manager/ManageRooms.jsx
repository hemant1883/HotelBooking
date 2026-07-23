import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Plus, Trash2 } from 'lucide-react';

const ManageRooms = () => {
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newRoom, setNewRoom] = useState({
        roomType: 'Deluxe', pricePerNight: '', capacity: 2, totalRooms: 5, description: ''
    });

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        try {
            const response = await api.get(`/rooms/hotel/${hotelId}`);
            setRooms(response.data);
        } catch (error) { console.error(error); }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/rooms/hotel/${hotelId}`, newRoom);
            setShowForm(false);
            fetchRooms(); // Refresh list
        } catch (error) { alert("Error adding room"); }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Rooms</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add Room'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAddRoom} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Room Type (e.g. Suite)" className="p-2 border rounded"
                           onChange={e => setNewRoom({...newRoom, roomType: e.target.value})} required />
                    <input type="number" placeholder="Price per Night" className="p-2 border rounded"
                           onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} required />
                    <input type="number" placeholder="Capacity" className="p-2 border rounded"
                           onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} required />
                    <input type="number" placeholder="Total Inventory" className="p-2 border rounded"
                           onChange={e => setNewRoom({...newRoom, totalRooms: e.target.value})} required />
                    <textarea placeholder="Description" className="p-2 border rounded col-span-2"
                              onChange={e => setNewRoom({...newRoom, description: e.target.value})} />
                    <button className="bg-green-600 text-white py-2 rounded col-span-2 font-bold">Save Room</button>
                </form>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Type</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Capacity</th>
                        <th className="p-4">Total Rooms</th>
                        <th className="p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map(room => (
                        <tr key={room.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{room.roomType}</td>
                            <td className="p-4">${room.pricePerNight}</td>
                            <td className="p-4">{room.capacity} Persons</td>
                            <td className="p-4">{room.totalRooms}</td>
                            <td className="p-4 text-red-600 cursor-pointer"><Trash2 size={18} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRooms;