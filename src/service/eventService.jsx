import axios from 'axios';

const API_URL = 'http://localhost:5000/collection-centers';

const getEvents = async (centerId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    const response = await axios.get(`${API_URL}/${centerId}/events`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

const createEvent = async (centerId, eventData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    const response = await axios.post(`${API_URL}/${centerId}/events`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

const updateEvent = async (centerId, eventId, eventData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    const response = await axios.put(`${API_URL}/${centerId}/events/${eventId}`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

const finishEvent = async (centerId, eventId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    const response = await axios.patch(`${API_URL}/${centerId}/events/${eventId}/finish`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error finishing event:', error);
    throw error;
  }
};

export default {
  getEvents,
  createEvent,
  updateEvent,
  finishEvent
};