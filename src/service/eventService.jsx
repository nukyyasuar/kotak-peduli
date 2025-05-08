import axios from "axios";

const API_URL = "http://localhost:5000";

const getEvents = async (centerId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Fetching events for centerId:", centerId);
    const response = await axios.get(
      `${API_URL}/collection-centers/${centerId}/events?showAll=true`,
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
      throw new Error("Expected an array of events");
    }
    console.log("Fetched events:", data);
    return data;
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

const finishEvent = async (centerId, eventId, eventData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Finishing event:", { centerId, eventId });
    const response = await axios.patch(
      `${API_URL}/collection-centers/${centerId}/events/${eventId}/finish`,
      {},
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
    throw new Error(
      error.response?.data?.meta?.message?.join(", ") ||
        "Failed to finish event"
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
  getEvents,
  createEvent,
  updateEvent,
  finishEvent,
  getUserCollectionCenter,
};