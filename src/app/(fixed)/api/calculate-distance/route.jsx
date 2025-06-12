export async function POST(req) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    const apiKey = process.env.NEXT_PUBLIC_OSRS_API_KEY;

    if (!apiKey) {
      throw new Error("ORS API key is not set in environment variables");
    }

    const url = "https://api.openrouteservice.org/v2/directions/driving-car";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude],
        ],
      }),
    });

    const result = await response.json();

    if (!result.routes || result.routes.length === 0) {
      throw new Error("No route found");
    }

    const distanceInMeters = result.routes[0].summary.distance;

    return new Response(
      JSON.stringify({
        distance: `${Math.round(distanceInMeters / 1000)} km`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ORS Error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to calculate distance",
        error: error.message,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
