import axios from "axios";

const API_URL = "http://localhost:5000";

const administratorService = {
  // Get all roles for a collection center
  async getRoles(collectionCenterId) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${API_URL}/collection-centers/${collectionCenterId}/roles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to fetch roles"
      );
    }
  },

  // Create a new role
  async createRole(collectionCenterId, roleData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${API_URL}/collection-centers/${collectionCenterId}/roles`,
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to create role"
      );
    }
  },

  // Update an existing role
  async updateRole(collectionCenterId, roleId, roleData) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.patch(
        `${API_URL}/collection-centers/${collectionCenterId}/roles/${roleId}`,
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to update role"
      );
    }
  },

  // Delete a role
  async deleteRole(collectionCenterId, roleId) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.delete(
        `${API_URL}/collection-centers/${collectionCenterId}/roles/${roleId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to delete role"
      );
    }
  },

  // Search role members with pagination
  async searchRoleMembers(
    collectionCenterId,
    searchQuery,
    page = 1,
    limit = 10,
    totalPages = 1,
    total = 5,
  ) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${API_URL}/collection-centers/${collectionCenterId}/roles/members`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchQuery,
            page,
            limit,
            totalPages,
            total,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to search role members"
      );
    }
  },

  // Assign roles to users
  async assignRoles(collectionCenterId, userAssignments) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      // Ensure userAssignments is always an array and not empty
      const user = Array.isArray(userAssignments)
        ? userAssignments.filter((u) => u && Object.keys(u).length > 0)
        : [userAssignments].filter((u) => u && Object.keys(u).length > 0);

      if (user.length === 0) {
        throw new Error("User assignments cannot be empty");
      }

      const payload = { user };

      const response = await axios.post(
        `${API_URL}/collection-centers/${collectionCenterId}/roles/assign`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to assign roles"
      );
    }
  },

  // Get user collection center
  async getUserCollectionCenter() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${API_URL}/users/profile/collection-center`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to fetch user collection center"
      );
    }
  },

  // Fetch collection center details (new method)
  async getCollectionCenter(collectionCenterId) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${API_URL}/collection-centers/${collectionCenterId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.meta?.message?.join(", ") ||
          "Failed to fetch collection center"
      );
    }
  },
};

export default administratorService;
