import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate
import api from '../api/axiosConfig';
import { Search, MapPin } from 'lucide-react'; // Added icons for the search bar

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                // Fetch first 4 hotels for the home page
                const response = await api.get('/hotels/search?size=4');
                setHotels(response.data.content);
            } catch (err) {
                console.error("Error fetching hotels:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCity.trim()) {
            navigate(`/hotels?city=${searchCity}`);
        }
    };

    return (
        <div>
            {/* --- HERO SECTION & SEARCH BAR --- */}
            <div className="bg-[#003580] text-white py-16 px-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Find your next stay</h1>
                    <p className="text-xl mb-10 text-blue-100">Search deals on hotels, homes, and much more...</p>

                    {/* Search Bar Container */}
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-lg p-2 shadow-2xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                            <MapPin className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="w-full text-gray-800 outline-none"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* --- FEATURED HOTELS SECTION --- */}
            <div className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Hotels</h2>

                {loading ? (
                    <div className="text-center py-10">Loading hotels...</div>
                ) : hotels.length === 0 ? (
                    <div className="bg-gray-50 p-10 text-center rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 italic text-lg">No hotels available yet. Managers are still adding properties!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {hotels.map(hotel => (
                            <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                <img
                                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                                    className="w-full h-48 object-cover"
                                    alt={hotel.name}
                                />
                                <div className="p-5">
                                    <h3 className="font-bold text-xl text-gray-800 mb-1">{hotel.name}</h3>
                                    <p className="text-gray-500 text-sm flex items-center mb-4">
                                        <MapPin size={14} className="mr-1" /> {hotel.city}
                                    </p>
                                    <Link
                                        to={`/hotel/${hotel.id}`}
                                        className="block text-center text-blue-600 font-bold border-2 border-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;