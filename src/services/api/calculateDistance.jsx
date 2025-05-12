"use client";

import { createRequestOptions, handleApiResponse } from "../helpers";

const calculateDistance = async (origin, destination) => {
  try {
    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    };

    console.log("Request Body:", requestBody);

    const response = await fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyBTJ0RDz8V6qAOZARcoMaVttH1Rco05I60`,
      createRequestOptions("POST", requestBody)
    );

    const result = await handleApiResponse(response);
    console.log(result);

    const distance = result.routes[0]?.legs[0]?.distance?.text;
    const duration = result.routes[0]?.legs[0]?.duration?.text;

    return { distance, duration };
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw new Error(error.message);
  }
};

export default calculateDistance;
