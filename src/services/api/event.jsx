import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const getEvents = async (collectionCenterId) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/events`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getEventsWithParams = async (
  collectionCenterId,
  page,
  keyword,
  sort,
  statusFilters
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      sort: sort,
    });

    if (keyword) {
      params.append("search", keyword);
    }
    if (statusFilters.length === 1) {
      params.append("isActive", statusFilters);
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/events?${params.toString()}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createEventCollectionCenter = async (collectionCenterId, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/events`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEventCollectionCenter = async (
  collectionCenterId,
  eventId,
  payload
) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/events/${eventId}`,
      createRequestOptions("PATCH", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deactivateEventCollectionCenter = async (collectionCenterId, eventId) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/events/${eventId}/deactivate`,
      createRequestOptions("PATCH")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getEvents,
  getEventsWithParams,
  createEventCollectionCenter,
  updateEventCollectionCenter,
  deactivateEventCollectionCenter,
};
