export async function POST(req) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    const originCoords = `${origin.longitude},${origin.latitude}`;
    const destinationCoords = `${destination.longitude},${destination.latitude}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords};${destinationCoords}?overview=false&geometries=geojson`;

    const response = await fetch(url);
    const result = await response.json();

    if (!result.routes || result.routes.length === 0) {
      throw new Error("No route found");
    }

    const distance = result.routes[0].distance;

    return new Response(
      JSON.stringify({
        distance: `${Math.round(distance / 1000)} km`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("OSRM Error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to calculate distance",
        error: error.message,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
