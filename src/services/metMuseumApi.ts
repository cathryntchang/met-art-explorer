import axios from 'axios';

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export const metMuseumApi = {
  async searchArtworks(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { q: query, hasImages: true }
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  async getArtworkDetails(objectId: number) {
    try {
      const response = await axios.get(`${BASE_URL}/objects/${objectId}`);
      return response.data;
    } catch (error) {
      console.error('Artwork details API error:', error);
      throw error;
    }
  }
};