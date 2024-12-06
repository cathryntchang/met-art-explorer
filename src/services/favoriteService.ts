import axios from 'axios';

export interface Favorite {
  id?: number;
  objectId: number;
  title: string;
  artist?: string;
  imageUrl?: string;
}

const BASE_URL = 'http://localhost:5000/favorites';

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    try {
      console.log('Fetching favorites...'); 
      const response = await axios.get('/favorites');
      console.log('Favorites response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  },

  async addFavorite(artwork: Favorite): Promise<Favorite> {
    try {
      console.log('Adding favorite:', artwork); 
      const response = await axios.post('/favorites', artwork);
      console.log('Add favorite response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  },

  async removeFavorite(objectId: number): Promise<void> {
    try {
      console.log('Removing favorite:', objectId); 
      await axios.delete(`/favorites/${objectId}`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  }
};