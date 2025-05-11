import axios from "axios";

const API_URL = "http://localhost:5000";

const getEvents = async (centerId, params = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    // Construct query parameters for server-side filtering, searching, and pagination
    const { search, isActive, page = 1, limit = 10, sortBy = "endDate", sortOrder = "asc" } = params;
    //gunakan sort dari mat
    
    let queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (isActive) queryParams.append("isActive", isActive);
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    console.log("Fetching events for centerId:", centerId, "with params:", Object.fromEntries(queryParams));
    
    const response = await axios.get(
      `${API_URL}/collection-centers/${centerId}/events?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const { data, meta } = response.data;
    
    if (!Array.isArray(data)) {
      throw new Error("Expected an array of events");
    }
    
    console.log("Fetched events:", data);
    console.log("Pagination metadata:", meta);
    
    return { 
      events: data, 
      pagination: meta.pagination || { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: data.length 
      } 
    };
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to fetch events"
    );
  }
};

const createEvent = async (centerId, eventData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Creating event with:", { centerId, eventData });
    const response = await axios.post(
      `${API_URL}/collection-centers/${centerId}/events`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Create event response:", data);
    return data;
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to create event"
    );
  }
};

const updateEvent = async (centerId, eventId, eventData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Updating event with:", { centerId, eventId, eventData });
    const response = await axios.patch(
      `${API_URL}/collection-centers/${centerId}/events/${eventId}`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Update event response:", data);
    return data;
  } catch (error) {
    console.error("Error updating event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") || "Failed to update event"
    );
  }
};

const finishEvent = async (centerId, eventId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Finishing event:", { centerId, eventId });
    
    // Use the standard update endpoint with isActive: false
    const response = await axios.patch(
      `${API_URL}/collection-centers/${centerId}/events/${eventId}`,
      { isActive: false }, // Set event as inactive to mark as finished
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    const data = response.data.data || response.data;
    console.log("Finish event response:", data);
    return data;
  } catch (error) {
    console.error(
      "Error finishing event:",
      error.response?.data || error.message
    );
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }
    throw error;
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
  getEvents,
  createEvent,
  updateEvent,
  finishEvent,
  getUserCollectionCenter,
};