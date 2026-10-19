import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createLocationController,
  getDeviceCoordinates,
  IDLE_LOCATION_STATUS,
} from "@/lib/location/controller";
import { lookupLocation, lookupReverseLocation } from "@/lib/restaurants/search";
import type { LocationCandidate } from "@/lib/location/model";
import { useAppStore } from "@/lib/store";

function visibleLocationLabel(label: string, source?: string) {
  if (source === "geo" && label.startsWith("Current location (")) return "Near you";
  return label;
}

function visibleStatusMessage(message: string | null) {
  if (message === "Location acquired. Finding the place name…") return "Finding your area name…";
  if (message === "Location acquired. Searching near you.") return "Searching near you.";
  return message;
}

export function LocationControl() {
  const location = useAppStore((state) => state.location);
  const setLocation = useAppStore((state) => state.setLocation);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(location.label);
  const [status, setStatus] = useState(IDLE_LOCATION_STATUS);
  const [candidates, setCandidates] = useState<LocationCandidate[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const changeRef = useRef<HTMLButtonElement>(null);
  const choicesRef = useRef<HTMLHeadingElement>(null);
  const helpId = useId();
  const choicesId = useId();
  const controller = useMemo(
    () =>
      createLocationController({
        getCoordinates: () => getDeviceCoordinates(globalThis.navigator?.geolocation),
        reverse: (coordinates) => lookupReverseLocation({ data: coordinates }),
        lookup: (text) => lookupLocation({ data: { query: text } }),
        onCandidates: setCandidates,
        onLocation: (next) => {
          setLocation(next);
          setQuery(next.label);
          setOpen(false);
          if (next.source === "manual") changeRef.current?.focus();
        },
        onStatus: (next) => {
          setStatus(next);
          if (next.error) setOpen(true);
        },
      }),
    [setLocation],
  );

  useEffect(() => () => controller.invalidate(), [controller]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (candidates.length) {
      choicesRef.current?.focus({ preventScroll: true });
      // The page has fixed discovery/navigation bars. Start the choices above
      // them instead of leaving a newly focused result behind those controls.
      choicesRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [candidates]);

  function toggleManual() {
    controller.cancel();
    setQuery(location.label);
    setOpen((value) => !value);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void controller.manual(query);
  }

  const displayLabel = visibleLocationLabel(location.label, location.source);
  const displayStatus = visibleStatusMessage(status.message);

  return (
    <section className="rounded-xl bg-surface p-4 shadow-border" aria-label="Search location">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-subtle">Searching near</p>
          <p className="break-words text-base text-fg">{displayLabel}</p>
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
            ref={changeRef}
            aria-label="Change location"
            title="Enter a location"
            aria-expanded={open}
            onClick={toggleManual}
          >
            <MapPin className="size-5" />
          </Button>
        </div>
      </div>
      {displayStatus ? (
        <p role="status" className="mt-2 text-sm text-muted">
          {displayStatus}
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
            ref={inputRef}
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
              {status.busy === "manual" ? "Finding…" : "Find location"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                controller.cancel();
                setOpen(false);
                changeRef.current?.focus();
              }}
            >
              Cancel
            </Button>
          </div>
          {candidates.length ? (
            <div aria-labelledby={choicesId} className="space-y-2">
              <h3 id={choicesId} ref={choicesRef} tabIndex={-1} className="scroll-mt-4 rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
                Choose a location
              </h3>
              <p className="text-xs text-subtle">Check the place type and full address before choosing.</p>
              <ul className="space-y-2">
                {candidates.map((candidate) => (
                  <li key={candidate.id}>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-auto min-h-11 w-full min-w-0 flex-col items-start gap-1 whitespace-normal px-3 py-3 text-left"
                      onFocus={(event) => {
                        if (event.currentTarget.matches(":focus-visible"))
                          event.currentTarget.scrollIntoView({ block: "center", behavior: "instant" });
                      }}
                      onClick={() => controller.choose(candidate)}
                    >
                      <span className="w-full break-words">Use {candidate.label}</span>
                      <span className="text-xs font-normal text-subtle">Place type: {candidate.placeType.replaceAll("_", " ")}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
