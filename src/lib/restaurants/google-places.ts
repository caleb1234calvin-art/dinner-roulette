import { createServerFn } from "@tanstack/react-start";
import { haversineMiles } from "./geo";

export interface GoogleReviewAuthor {
  displayName: string;
  uri: string | null;
  photoUri: string | null;
}

export interface GoogleRestaurantReview {
  rating: number | null;
  text: string;
  relativePublishTimeDescription: string | null;
  author: GoogleReviewAuthor;
  googleMapsUri: string | null;
}

export interface GoogleRestaurantReviewData {
  configured: boolean;
  matched: boolean;
  rating: number | null;
  reviewCount: number | null;
  reviews: GoogleRestaurantReview[];
  placeUri: string | null;
  reviewsUri: string | null;
  writeAReviewUri: string | null;
  fallbackMapsUri: string;
}

type GoogleText = {
  text?: string;
  languageCode?: string;
};

type GoogleReview = {
  rating?: number;
  text?: GoogleText;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  googleMapsUri?: string;
};

type GooglePlace = {
  id?: string;
  displayName?: GoogleText;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  googleMapsLinks?: {
    placeUri?: string;
    reviewsUri?: string;
    writeAReviewUri?: string;
  };
};

type GoogleSearchResponse = {
  places?: GooglePlace[];
};

export interface GoogleReviewLookupInput {
  name: string;
  address: string;
  lat: number;
  lon: number;
}

function mapsSearchUri(data: GoogleReviewLookupInput): string {
  const location = data.address && data.address !== "Address unavailable" ? data.address : `${data.lat},${data.lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.name} ${location}`)}`;
}

function emptyResult(data: GoogleReviewLookupInput, configured: boolean): GoogleRestaurantReviewData {
  return {
    configured,
    matched: false,
    rating: null,
    reviewCount: null,
    reviews: [],
    placeUri: null,
    reviewsUri: null,
    writeAReviewUri: null,
    fallbackMapsUri: mapsSearchUri(data),
  };
}

export const lookupGoogleRestaurantReviews = createServerFn({ method: "POST" })
  .validator((data: GoogleReviewLookupInput) => {
    if (!data.name?.trim()) throw new Error("Restaurant name is required");
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) {
      throw new Error("Restaurant location is required");
    }
    return {
      name: data.name.trim().slice(0, 180),
      address: (data.address ?? "").trim().slice(0, 300),
      lat: data.lat,
      lon: data.lon,
    };
  })
  .handler(async ({ data }): Promise<GoogleRestaurantReviewData> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
    if (!apiKey) return emptyResult(data, false);

    const addressPart = data.address && data.address !== "Address unavailable" ? `, ${data.address}` : "";

    try {
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.reviews,places.googleMapsLinks",
        },
        body: JSON.stringify({
          textQuery: `${data.name}${addressPart}`,
          pageSize: 1,
          languageCode: "en",
          regionCode: "US",
          locationBias: {
            circle: {
              center: { latitude: data.lat, longitude: data.lon },
              radius: 750,
            },
          },
        }),
      });

      if (!response.ok) {
        console.warn("Google Places review lookup failed", response.status);
        return emptyResult(data, true);
      }

      const payload = (await response.json()) as GoogleSearchResponse;
      const place = payload.places?.[0];
      if (!place) return emptyResult(data, true);

      const placeLat = place.location?.latitude;
      const placeLon = place.location?.longitude;
      if (
        Number.isFinite(placeLat) &&
        Number.isFinite(placeLon) &&
        haversineMiles(data.lat, data.lon, placeLat as number, placeLon as number) > 1.5
      ) {
        return emptyResult(data, true);
      }

      const reviews = (place.reviews ?? []).slice(0, 5).map((review): GoogleRestaurantReview => ({
        rating: Number.isFinite(review.rating) ? (review.rating as number) : null,
        text: review.text?.text?.trim() ?? "",
        relativePublishTimeDescription: review.relativePublishTimeDescription?.trim() ?? null,
        author: {
          displayName: review.authorAttribution?.displayName?.trim() || "Google Maps reviewer",
          uri: review.authorAttribution?.uri ?? null,
          photoUri: review.authorAttribution?.photoUri ?? null,
        },
        googleMapsUri: review.googleMapsUri ?? null,
      }));

      return {
        configured: true,
        matched: true,
        rating: Number.isFinite(place.rating) ? (place.rating as number) : null,
        reviewCount: Number.isFinite(place.userRatingCount) ? (place.userRatingCount as number) : null,
        reviews,
        placeUri: place.googleMapsLinks?.placeUri ?? null,
        reviewsUri: place.googleMapsLinks?.reviewsUri ?? null,
        writeAReviewUri: place.googleMapsLinks?.writeAReviewUri ?? null,
        fallbackMapsUri: mapsSearchUri(data),
      };
    } catch (error) {
      console.warn("Google Places review lookup error", error);
      return emptyResult(data, true);
    }
  });
