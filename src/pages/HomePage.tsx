import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-gray-200 p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-12 text-center border-4 border-gray-300">
        <h1 className="text-5xl font-serif text-brown-900 mb-8 leading-tight">
          Met Art Explorer
        </h1>
        <p className="text-xl text-gray-700 mb-6 italic">
          Timeless Art, Rediscovered
        </p>
        <SearchBar />
        
        <div className="mt-4">
        <Link
  to="/favorites"
  className="bg-burgundy-500 hover:bg-burgundy-600 text-white px-6 py-3 rounded-full transition duration-200 focus:outline-none hover:text-white">
        View Favorites
        </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;