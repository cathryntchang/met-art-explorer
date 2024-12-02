import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 justify-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search artworks..."
        className="w-3/4 px-4 py-2 border-2 border-gray-300 rounded-lg"
      />
      <button 
        type="submit" 
        className="bg-burgundy-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-burgundy-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-burgundy-400"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
