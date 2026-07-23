import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Image as ImageIcon, MapPin, Phone, Info } from 'lucide-react';

const AddHotel = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        description: '',
        contactNumber: '',
        images: [] // Initialized as empty array
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure at least one image is provided since we made it manual
        if (formData.images.length === 0 || !formData.images[0]) {
            alert("Please provide at least one image URL for your hotel.");
            return;
        }

        try {
            await api.post('/hotels/manage', formData);
            alert("Hotel Added Successfully!");
            navigate('/manager/dashboard');
        } catch (error) {
            alert("Failed to add hotel: " + (error.response?.data || "Server error"));
        }
    };

    const handleImageChange = (url) => {
        setPreviewUrl(url);
        setFormData({ ...formData, images: url ? [url] : [] });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">List Your Property</h1>
                <p className="text-gray-500 mt-2">Fill in the details below to start receiving bookings.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">

                {/* Hotel Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-blue-600 border-b pb-2">Basic Information</h2>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Hotel Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Grand Plaza Resort"
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g. New York"
                                    className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="+1 234 567 890"
                                    className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Exact Address</label>
                        <input
                            type="text"
                            placeholder="Street name, Building number, Landmark"
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            placeholder="Describe your hotel, nearby attractions, and atmosphere..."
                            className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Manual Image Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-blue-600 border-b pb-2">Visuals</h2>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Main Hotel Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Paste a link to your hotel photo (JPG, PNG)"
                                className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => handleImageChange(e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">Tip: Use a high-quality URL from a site like Unsplash or your own hosting.</p>
                    </div>

                    {/* Image Preview Window */}
                    {previewUrl && (
                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Live Preview</label>
                            <div className="relative rounded-xl overflow-hidden h-48 border-2 border-blue-100">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-8"
                >
                    Create Property Listing
                </button>
            </form>
        </div>
    );
};

export default AddHotel;