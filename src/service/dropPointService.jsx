import axios from 'axios';

const API_URL = 'http://localhost:5000/collection-centers';

const collectionCenterService = {
  // Create a new collection center post
  createPost: async (id, postData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log('Creating post with:', { id, postData });
      const response = await axios.post(`${API_URL}/${id}/posts`, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });

      const data = response.data.data || response.data;
      console.log('Create post response:', data);
      return data;
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.meta?.message?.join(', ') || 'Failed to create post'
      );
    }
  },

  // Update an existing collection center post
  updatePost: async (id, postId, postData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log('Updating post with:', { id, postId, postData });
      const response = await axios.patch(`${API_URL}/${id}/posts/${postId}`, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });

      const data = response.data.data || response.data;
      console.log('Update post response:', data);
      return data;
    } catch (error) {
      console.error('Error updating post:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.meta?.message?.join(', ') || 'Failed to update post'
      );
    }
  },

  // Delete a collection center post
  deletePost: async (id, postId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log('Deleting post:', { id, postId });
      const response = await axios.delete(`${API_URL}/${id}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });

      const data = response.data.data || response.data;
      console.log('Delete post response:', data);
      return data;
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.meta?.message?.join(', ') || 'Failed to delete post'
      );
    }
  },

  // Get all posts for a collection center
  getPosts: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log('Fetching posts for centerId:', id);
      const response = await axios.get(`${API_URL}/${id}/posts?showAll=True`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });

      const data = response.data.data || response.data;
      if (!Array.isArray(data)) {
        throw new Error('Expected an array of posts');
      }
      console.log('Fetched posts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.meta?.message?.join(', ') || 'Failed to fetch posts'
      );
    }
  }
};

export default collectionCenterService;