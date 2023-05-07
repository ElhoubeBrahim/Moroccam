import { LocationResponse } from "../interface/LocationResponse";
import { NearbyPlace } from "../interface/NearbyPlace";
import { PlaceDetails } from "../interface/PlaceDetails";
import axios from "axios";

const apiKey = "AIzaSyB-qSoOob2flYr4zK2jBdDJi-9wKtdYO48";

/**
 * Get the place ID from the place name using Google Maps API
 *
 * @param {string} placeName
 * @returns integer
 */
async function getPlaceID(placeName: string): Promise<string | null> {
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`
	);

	const results: PlaceDetails[] = response.data.results;

	if (results.length === 0) {
		return null;
	}

	return results[0].place_id;
}

/**
 * Get the geo-location and images of a place using Google Maps API
 *
 * @param {string} placeName
 * @returns object
 */
export async function getPlaceGeoinfo(placeName: string) {
	// Get general information about the place
	const placeID: string | null = await getPlaceID(placeName);
	if (placeID === null) {
		return null;
	}

	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${apiKey}`
	);

	// Get nearby restaurants and hotels
	const result: LocationResponse = response.data.result;
	const location = result.geometry.location;
	const restaurants: NearbyPlace[] = await getNearbyPlaces(
		location.lat,
		location.lng,
		"restaurant"
	);
	const hotels: NearbyPlace[] = await getNearbyPlaces(
		location.lat,
		location.lng,
		"lodging"
	);

	// Return results
	return {
		city: result.address_components[0].long_name,
		location: location,
		images: result.photos
			? result.photos.map((photo) => {
					return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`;
			  })
			: [],
		restaurants: restaurants,
		hotels: hotels,
	};
}

async function getNearbyPlaces(
	latitude: number,
	longitude: number,
	type: "restaurant" | "lodging"
): Promise<NearbyPlace[]> {
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=1500&type=${type}&key=${apiKey}`
	);

	const results: LocationResponse[] = response.data.results;
	return results.map((result: LocationResponse) => {
		return {
			name: result.name,
			description: result.vicinity,
			rating: result.rating,
			image: result.photos
				? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${apiKey}`
				: null,
		};
	});
}
