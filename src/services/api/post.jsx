import { createRequestOptions, handleApiResponse } from "../helpers";
import { fetchWithAuth } from "src/services/helpers";

const getPosts = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${id}/posts`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPostsWithParams = async (
  collectionCenterId,
  page,
  keyword,
  postTypeFilters
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
    if (postTypeFilters.length > 0) {
      appendMultipleFilters(params, "postTypes", postTypeFilters);
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/posts?${params.toString()}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPosts = async (collectionCenterId, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/posts`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePost = async (collectionCenterId, postId) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/posts/${postId}`,
      createRequestOptions("DELETE")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePost = async (collectionCenterId, postId, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/collection-centers/${collectionCenterId}/posts/${postId}`,
      createRequestOptions("PATCH", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getPosts, getPostsWithParams, createPosts, deletePost, updatePost };
