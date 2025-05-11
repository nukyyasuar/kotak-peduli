import axios from "axios";

const API_URL = "http://localhost:5000";

// Get posts with server-side filtering and pagination
const getPostsWithFilters = async (centerId, queryString) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log(`Fetching posts for centerId: ${centerId} with filters: ${queryString}`);
    const response = await axios.get(
      `${API_URL}/collection-centers/${centerId}/posts?${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const responseData = response.data;
    console.log("Fetched filtered posts:", responseData);
    return {
      data: responseData.data || [],
      meta: responseData.meta || { total: 0, page: 1, limit: 10 }
    };
  } catch (error) {
    console.error("Error fetching filtered posts:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to fetch posts"
    );
  }
};

const getPosts = async (centerId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Fetching all posts for centerId:", centerId);
    const response = await axios.get(
      `${API_URL}/collection-centers/${centerId}/posts?showAll=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    if (!Array.isArray(data)) {
      throw new Error("Expected an array of posts");
    }
    console.log("Fetched posts:", data);
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to fetch posts"
    );
  }
};

const createPost = async (centerId, postData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Creating post with:", { centerId, postData });
    const response = await axios.post(
      `${API_URL}/collection-centers/${centerId}/posts`,
      postData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Create post response:", data);
    return data;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to create post"
    );
  }
};

const updatePost = async (centerId, postId, postData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Updating post with:", { centerId, postId, postData });
    const response = await axios.patch(
      `${API_URL}/collection-centers/${centerId}/posts/${postId}`,
      postData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Update post response:", data);
    return data;
  } catch (error) {
    console.error("Error updating post:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to update post"
    );
  }
};

const deletePost = async (centerId, postId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Deleting post:", { centerId, postId });
    const response = await axios.delete(
      `${API_URL}/collection-centers/${centerId}/posts/${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Delete post response:", data);
    return data;
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to delete post"
    );
  }
};

const getUserCollectionCenter = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Fetching user collection center");
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
};

export default {
  getPosts,
  getPostsWithFilters,
  createPost,
  updatePost,
  deletePost,
  getUserCollectionCenter,
};