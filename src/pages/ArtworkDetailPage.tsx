import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { metMuseumApi } from '../services/metMuseumApi';

interface ArtworkDetails {
  primaryImage: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
}

const ArtworkDetailPage: React.FC = () => {
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { objectId } = useParams<{ objectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        if (objectId) {
          const details = await metMuseumApi.getArtworkDetails(parseInt(objectId));
          setArtwork(details);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching artwork details:', error);
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [objectId]);

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
          <button 
            onClick={handleBack} 
            className="mb-6 bg-burgundy-500 hover:bg-burgundy-600 text-white px-6 py-3 rounded-lg transition duration-200"
          >
            Back to Results
          </button>
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
