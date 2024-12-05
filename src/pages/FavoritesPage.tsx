import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteService, Favorite } from '../services/favoriteService';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoritesData = await favoriteService.getFavorites();
        setFavorites(favoritesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to fetch favorites. Please check your connection and try again.');
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (objectId: number) => {
    try {
      await favoriteService.removeFavorite(objectId);
      setFavorites(favorites.filter(fav => fav.objectId !== objectId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove favorite. Please try again.');
    }
  };

  const handleArtworkClick = (objectId: number) => {
    navigate(`/artwork/${objectId}`);
  };

  const handleReturnToSearch = () => {
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Return to Search Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={handleReturnToSearch}
            className="bg-burgundy-500 hover:bg-burgundy-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Back to Search
          </button>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-burgundy-700 text-center">
          My Favorite Artworks
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        {favorites.length === 0 && !error ? (
          <div className="text-center text-gray-600 text-xl">
            No favorite artworks yet. Start exploring!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((artwork) => (
              <div
                key={artwork.objectId}
                className="relative group"
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  onClick={() => handleArtworkClick(artwork.objectId)}
                  className="w-full h-48 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-75 transition transform hover:scale-105"
                />
                <button
                  onClick={() => handleRemoveFavorite(artwork.objectId)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <p className="mt-2 text-center text-sm truncate">{artwork.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
