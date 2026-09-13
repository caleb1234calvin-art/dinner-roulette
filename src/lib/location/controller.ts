import {
  coordinateLocation,
  isGeographicLocation,
  normalizeLocationQuery,
  requireCoordinates,
} from "./model.ts";
import type { Coordinates, GeographicLocation } from "./model.ts";
import type { SearchLocation } from "../restaurants/types";

export interface LocationStatus {
  busy: "geo" | "manual" | null;
  message: string | null;
  error: string | null;
}

export const IDLE_LOCATION_STATUS: LocationStatus = { busy: null, message: null, error: null };

export function geolocationErrorMessage(error: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === 1) return "Location permission was denied. You can enter a location manually.";
  if (code === 2) return "Your location is unavailable. Try again or enter a location manually.";
  if (code === 3) return "Location request timed out. Try again or enter a location manually.";
  return "Couldn't get your location. Try again or enter a location manually.";
}

/** Called only from the user's location action, never during page initialization. */
export function getDeviceCoordinates(
  geolocation?: Pick<Geolocation, "getCurrentPosition">,
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error("Location isn't available in this browser. Enter a location manually."));
      return;
    }
    const fail = (error: unknown) => reject(new Error(geolocationErrorMessage(error)));
    try {
      geolocation.getCurrentPosition(
        (position) => {
          try {
            resolve(
              requireCoordinates({ lat: position.coords.latitude, lon: position.coords.longitude }),
            );
          } catch {
            fail({ code: 2 });
          }
        },
        fail,
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    } catch (error) {
      fail(error);
    }
  });
}

/** Latest user intent wins, including when a native GPS callback cannot be cancelled. */
export function createLocationController(deps: {
  getCoordinates: () => Promise<Coordinates>;
  reverse: (coordinates: Coordinates) => Promise<GeographicLocation>;
  lookup: (query: string) => Promise<GeographicLocation>;
  onLocation: (location: SearchLocation) => void;
  onStatus: (status: LocationStatus) => void;
}) {
  let request = 0;
  const invalidate = () => {
    request += 1;
  };
  const cancel = () => {
    invalidate();
    deps.onStatus(IDLE_LOCATION_STATUS);
  };
  return {
    invalidate,
    cancel,
    async device() {
      const id = ++request;
      deps.onStatus({ busy: "geo", message: "Finding your location…", error: null });
      try {
        const coordinates = requireCoordinates(await deps.getCoordinates());
        if (id !== request) return;
        // Begin discovery immediately; reverse geocoding only improves the label.
        deps.onLocation({ ...coordinateLocation(coordinates), source: "geo" });
        deps.onStatus({
          busy: "geo",
          message: "Location acquired. Finding the place name…",
          error: null,
        });
        let location: GeographicLocation | undefined;
        try {
          location = await deps.reverse(coordinates);
        } catch {
          /* Coordinates remain usable. */
        }
        if (id !== request) return;
        if (isGeographicLocation(location))
          deps.onLocation({ ...location, ...coordinates, source: "geo" });
        deps.onStatus({
          busy: null,
          message: "Location acquired. Searching near you.",
          error: null,
        });
      } catch (error) {
        if (id !== request) return;
        deps.onStatus({
          busy: null,
          message: null,
          error: error instanceof Error ? error.message : geolocationErrorMessage(error),
        });
      }
    },
    async manual(query: string) {
      const id = ++request;
      deps.onStatus({ busy: "manual", message: "Finding that location…", error: null });
      try {
        const result = await deps.lookup(normalizeLocationQuery(query));
        if (id !== request) return;
        if (!isGeographicLocation(result))
          throw new Error("Couldn't find that place. Try adding the region and country.");
        deps.onLocation({ ...result, source: "manual" });
        deps.onStatus({ busy: null, message: `Location set to ${result.label}.`, error: null });
      } catch (error) {
        if (id !== request) return;
        deps.onStatus({
          busy: null,
          message: null,
          error:
            error instanceof Error ? error.message : "Couldn't find that place. Please try again.",
        });
      }
    },
  };
}
