import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { metMuseumApi } from '../services/metMuseumApi';
import { favoriteService } from '../services/favoriteService';

interface ArtworkDetails {
  primaryImage: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
  objectID: number;
}

const ArtworkDetailPage: React.FC = () => {
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        if (objectId) {
          const details = await metMuseumApi.getArtworkDetails(parseInt(objectId));
          setArtwork(details);
          
          // Check if artwork is already in favorites
          const favorites = await favoriteService.getFavorites();
          const favoriteExists = favorites.some(fav => fav.objectId === details.objectID);
          setIsFavorite(favoriteExists);
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching artwork details:', error);
        setLoading(false);
      }
    };
    fetchArtworkDetails();
  }, [objectId]);

  const toggleFavorite = async () => {
    if (!artwork) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        await favoriteService.removeFavorite(artwork.objectID);
        setIsFavorite(false);
      } else {
        // Add to favorites
        await favoriteService.addFavorite({
          objectId: artwork.objectID,
          title: artwork.title,
          artist: artwork.artistDisplayName,
          imageUrl: artwork.primaryImage
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!artwork) return <div className="min-h-screen flex items-center justify-center text-white">Artwork not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src={artwork.primaryImage}
            alt={artwork.title}
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg"
          />
        </div>
        <div className="md:w-1/2 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="bg-burgundy-500 hover:bg-burgundy-600 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Back
            </button>
            <button
              onClick={toggleFavorite}
              className={`px-6 py-3 rounded-lg transition duration-200 ${
                isFavorite 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-burgundy-700">{artwork.title}</h1>
          <div className="text-lg text-gray-800 space-y-3">
            <p><strong className="text-burgundy-600">Artist:</strong> {artwork.artistDisplayName || 'Unknown'}</p>
            <p><strong className="text-burgundy-600">Date:</strong> {artwork.objectDate}</p>
            <p><strong className="text-burgundy-600">Medium:</strong> {artwork.medium}</p>
            <p><strong className="text-burgundy-600">Dimensions:</strong> {artwork.dimensions}</p>
            <p><strong className="text-burgundy-600">Department:</strong> {artwork.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailPage;