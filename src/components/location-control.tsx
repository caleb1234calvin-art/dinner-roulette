import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createLocationController,
  getDeviceCoordinates,
  IDLE_LOCATION_STATUS,
} from "@/lib/location/controller";
import { lookupLocation, lookupReverseLocation } from "@/lib/restaurants/search";
import { useAppStore } from "@/lib/store";

export function LocationControl() {
  const location = useAppStore((state) => state.location);
  const setLocation = useAppStore((state) => state.setLocation);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(location.label);
  const [status, setStatus] = useState(IDLE_LOCATION_STATUS);
  const helpId = useId();
  const controller = useMemo(
    () =>
      createLocationController({
        getCoordinates: () => getDeviceCoordinates(globalThis.navigator?.geolocation),
        reverse: (coordinates) => lookupReverseLocation({ data: coordinates }),
        lookup: (text) => lookupLocation({ data: { query: text } }),
        onLocation: (next) => {
          setLocation(next);
          setQuery(next.label);
          setOpen(false);
        },
        onStatus: setStatus,
      }),
    [setLocation],
  );

  useEffect(() => () => controller.invalidate(), [controller]);

  function toggleManual() {
    controller.cancel();
    setQuery(location.label);
    setOpen((value) => !value);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void controller.manual(query);
  }

  return (
    <section className="rounded-xl bg-surface p-4 shadow-border" aria-label="Search location">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-subtle">Searching near</p>
          <p className="break-words text-base text-fg">{location.label}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Use my location"
            title="Use my location"
            disabled={status.busy === "geo"}
            onClick={() => void controller.device()}
          >
            {status.busy === "geo" ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <LocateFixed className="size-5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Change location"
            title="Enter a location"
            aria-expanded={open}
            onClick={toggleManual}
          >
            <MapPin className="size-5" />
          </Button>
        </div>
      </div>
      {status.message ? (
        <p role="status" className="mt-2 text-sm text-muted">
          {status.message}
        </p>
      ) : null}
      {status.error ? (
        <p role="alert" className="mt-2 text-sm text-danger">
          {status.error}
        </p>
      ) : null}
      {open ? (
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <Input
            value={query}
            onChange={(event) => {
              controller.cancel();
              setQuery(event.target.value);
            }}
            placeholder="City, region and country"
            aria-label="City, region and country, or postal code"
            aria-describedby={helpId}
            maxLength={300}
            autoComplete="off"
          />
          <p id={helpId} className="text-xs text-subtle">
            For example: Toronto, Ontario, Canada. Include a country for ambiguous cities or postal
            codes.
          </p>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={status.busy === "manual" || !query.trim()}
            >
              {status.busy === "manual" ? "Finding…" : "Set location"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                controller.cancel();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
