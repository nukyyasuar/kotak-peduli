import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");
  return token;
};

// Helper function to create axios instance with auth token
const createAxiosInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
};

// Roles service for superadmin
const RolesService = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  // Get role by ID
  getRoleById: async (id) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new role
  createRole: async (roleData) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.post('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },
  
  // Update role
  updateRole: async (id, roleData) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.patch(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete role
  deleteRole: async (id) => {
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting role with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get user collection center
  getUserCollectionCenter: async () => {
    try {
      const axiosInstance = createAxiosInstance();
      console.log("Fetching user collection center");
      const response = await axiosInstance.get('/users/profile/collection-center');
      const data = response.data.data || response.data;
      console.log("User collection center:", data);
      return data;
    } catch (error) {
      console.error(
        "Error fetching user collection center:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to fetch user collection center"
      );
    }
  },
  
  // Get collection centers with filtering, sorting, and pagination
  getCollectionCenters: async (params = {}) => {
    try {
      const axiosInstance = createAxiosInstance();
      const { search, sort, page = 1, limit = 10 } = params;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (sort) queryParams.append('sort', sort);
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      console.log(`Fetching collection centers with params: ${queryParams.toString()}`);
      
      const response = await axiosInstance.get(`/collection-centers?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collection centers:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
        "Failed to fetch collection centers"
      );
    }
  },

  // Process collection center
  processCollectionCenter: async (id, processData) => {
    try {
      const axiosInstance = createAxiosInstance();
      console.log(`Processing collection center with ID ${id}`);
      const response = await axiosInstance.post(`/collection-centers/${id}/process`, processData);
      return response.data;
    } catch (error) {
      console.error(
        `Error processing collection center with ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
        "Failed to process collection center"
      );
    }
  }
};

export default RolesService;