import { createRequestOptions, handleApiResponse } from "../helpers";
import { fetchWithAuth } from "src/services/helpers";

const getMembersWithParams = async (
  collectionCenterId,
  page,
  keyword,
  memberRoleFilters
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    const appendMultipleFilters = (params, key, values) => {
      values.forEach((val) => params.append(key, val));
    };

    if (keyword) {
      params.append("search", keyword);
    }
    if (memberRoleFilters.length > 0) {
      appendMultipleFilters(params, "roles", memberRoleFilters);
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

const createUpdateMember = async (collectionCenterId, payload) => {
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

const deleteMember = async (collectionCenterId, memberId) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/roles/members/${memberId}`,
      createRequestOptions("DELETE")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllRole = async (collectionCenterId) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/roles`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getMembersWithParams, createUpdateMember, getAllRole, deleteMember };
