import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const getCollectionCenters = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers?limit=50&sort=name:asc`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOneCollectionCenter = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${id}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCollectionCenter = async (payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCollectionCenterDonations = async (
  id,
  page,
  keyword,
  statusFilters,
  donationTypesFilters,
  pickupFilters
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      sort: "createdAt:desc",
    });

    const appendMultipleFilters = (params, key, values) => {
      values.forEach((val) => params.append(key, val));
    };

    if (keyword) {
      params.append("search", keyword);
    }
    if (statusFilters.length > 0) {
      appendMultipleFilters(params, "statusTypes", statusFilters);
    }
    if (donationTypesFilters.length > 0) {
      appendMultipleFilters(params, "donationTypes", donationTypesFilters);
    }
    if (pickupFilters.length > 0) {
      appendMultipleFilters(params, "pickupTypes", pickupFilters);
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${id}/donation-items?${params.toString()}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCollectionCenter = async (collectionCenterid, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterid}`,
      createRequestOptions("PATCH", payload)
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getCollectionCenters,
  getOneCollectionCenter,
  createCollectionCenter,
  getCollectionCenterDonations,
  updateCollectionCenter,
};
