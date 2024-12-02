import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { metMuseumApi } from '../services/metMuseumApi';

const SearchResultsPage: React.FC = () => {
  const [artworks, setArtworks] = useState<{ id: number; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    const fetchArtworks = async () => {
      if (query) {
        try {
          const results = await metMuseumApi.searchArtworks(query);
          
          // Fetch images for first 12 results
          const artworkDetails = await Promise.all(
            results.objectIDs.slice(0, 12).map(async (objectId: number) => {
              const details = await metMuseumApi.getArtworkDetails(objectId);
              return {
                id: objectId,
                imageUrl: details.primaryImage || ''
              };
            })
          );

          // Filter out entries without images
          const validArtworks = artworkDetails.filter(artwork => artwork.imageUrl);
          
          setArtworks(validArtworks);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching artworks:', error);
          setLoading(false);
        }
      }
    };

    fetchArtworks();
  }, [location.search]);

  const handleBack = () => {
    navigate('/');
  };

  const handleArtworkClick = (objectId: number) => {
    navigate(`/artwork/${objectId}`);
  };

  const searchQuery = new URLSearchParams(location.search).get('q') || 'No search query';

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <button 
          onClick={handleBack} 
          className="mb-6 bg-burgundy-500 hover:bg-burgundy-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Back to Search
        </button>
        <h1 className="text-3xl font-bold mb-6 text-burgundy-700 text-center">
          Search Results for: <span className="text-gray-900">{searchQuery}</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artworks.map((artwork) => (
            <div 
              key={artwork.id} 
              onClick={() => handleArtworkClick(artwork.id)}
              className="cursor-pointer hover:opacity-75 transition transform hover:scale-105"
            >
              <img
                src={artwork.imageUrl}
                alt={`Artwork ${artwork.id}`}
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
