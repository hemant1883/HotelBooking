import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Star, MapPin, ImageOff } from 'lucide-react'; // Added ImageOff icon

const HotelListing = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get('city');

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/hotels/search?city=${city || ''}`);
                setHotels(response.data.content);
            } catch (error) {
                console.error("Error fetching hotels", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [city]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {city ? `Stays in ${city}` : 'Explore All Destinations'}
                    </h1>
                    <p className="text-gray-500 mt-1">{hotels.length} properties found</p>
                </div>
            </div>

            {hotels.length === 0 ? (
                <div className="bg-white p-16 text-center rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="text-gray-400" size={30} />
                    </div>
                    <p className="text-xl font-semibold text-gray-700">No properties found</p>
                    <p className="text-gray-500 mt-2">Try searching for a different city or browse all hotels.</p>
                    <Link to="/hotels" className="mt-6 inline-block text-blue-600 font-bold hover:underline">
                        View all hotels
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="relative h-56 bg-gray-200">
                                {hotel.images && hotel.images.length > 0 && hotel.images[0] !== "" ? (
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageOff size={48} strokeWidth={1} />
                                        <span className="text-xs mt-2 uppercase tracking-widest font-semibold">No Image Provided</span>
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center">
                                    <Star className="text-yellow-500 fill-yellow-500 mr-1" size={14} />
                                    <span className="text-gray-800 font-bold text-sm">{hotel.rating > 0 ? hotel.rating : 'New'}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{hotel.name}</h3>
                                <p className="flex items-center text-gray-500 text-sm mb-4">
                                    <MapPin size={14} className="mr-1 text-blue-500" /> {hotel.city}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-gray-400 text-xs">Starting from rooms</span>
                                    <Link
                                        to={`/hotel/${hotel.id}`}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-200"
                                    >
                                        Check Availability
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotelListing;