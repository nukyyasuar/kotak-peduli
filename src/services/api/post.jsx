import { createRequestOptions, handleApiResponse } from "../helpers";

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

export { getPosts };
