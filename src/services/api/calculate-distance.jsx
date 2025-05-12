// pages/api/calculate-distance.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ message: "Missing origin or destination" });
  }

  const GOOGLE_API_KEY = AIzaSyBTJ0RDz8V6qAOZARcoMaVttH1Rco05I60;

  const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`;

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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "routes.legs.distance,routes.legs.duration",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ message: "Failed to get route", error: errorData });
    }

    const result = await response.json();

    const distance = result.routes[0]?.legs[0]?.distance?.text;
    const duration = result.routes[0]?.legs[0]?.duration?.text;

    return res.status(200).json({ distance, duration });
  } catch (error) {
    console.error("Google API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
