import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const getAdminMembers = async (collectionCenterId, page, keyword) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "2",
      sort: "endDate:asc",
    });

    if (keyword) {
      params.append("search", keyword);
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/roles/members?${params.toString()}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUpdateAdminCollaborator = async (collectionCenterId, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/roles/assign`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getAdminMembers, createUpdateAdminCollaborator };
