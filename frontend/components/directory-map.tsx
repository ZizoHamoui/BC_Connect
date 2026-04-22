"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Business } from "@/components/business-card";

interface DirectoryMapProps {
  businesses: Business[];
  selectedId?: string | null;
  onPinClick?: (id: string) => void;
  onLocationChange?: (lat: number, lng: number) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Custom map style — clean, minimal, BC Connect palette
const MAP_STYLES = [
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e8eaed" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e8eaed" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#d1d5db" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#8B90A0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dce8f0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6B7080" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f9fafb" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#eef3ed" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d1d5db" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#4B5162" }] },
  { featureType: "administrative.province", elementType: "labels.text.fill", stylers: [{ color: "#2C2F36" }] },
];

let scriptPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google?.maps) { resolve(); return; }

    const callbackName = "__gmaps_cb__";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[callbackName] = () => resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

function buildInfoWindowContent(biz: Business) {
  return `
    <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:180px;max-width:240px;padding:2px">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8B90A0;margin:0 0 4px">${biz.industry}</p>
      <h4 style="font-size:15px;font-weight:700;color:#111218;margin:0 0 4px;line-height:1.2">${biz.name}</h4>
      <p style="font-size:12px;color:#6B7080;margin:0 0 8px">📍 ${biz.city}, ${biz.region}</p>
      ${biz.description ? `<p style="font-size:12px;color:#4B5162;margin:0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${biz.description}</p>` : ""}
    </div>
  `;
}

export function DirectoryMap({
  businesses,
  selectedId,
  onPinClick,
  onLocationChange,
}: DirectoryMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clustererRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null); // single shared info window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myLocationMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myLocationCircleRef = useRef<any>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const google = (window as any).google;

      mapRef.current = new google.maps.Map(containerRef.current, {
        center: { lat: 53.7267, lng: -127.6476 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
        styles: MAP_STYLES,
      });

      // Single shared info window
      infoWindowRef.current = new google.maps.InfoWindow({ maxWidth: 260 });

      // Signal that map is ready — this re-triggers the marker effect
      setMapReady(true);
    }).catch(console.error);
    return () => { cancelled = true; };
  }, []);

  // Sync business markers — depends on mapReady so it reruns once Google Maps finishes
  // loading even when businesses prop has already arrived (race condition fix)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google;
    if (!google) return;

    // Remove old clusterer and markers
    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();
    infoWindowRef.current?.close();

    const valid = businesses.filter((b) => b.lat != null && b.lng != null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMarkers: any[] = [];

    valid.forEach((biz) => {
      const isSelected = biz.id === selectedId;

      const marker = new google.maps.Marker({
        position: { lat: biz.lat!, lng: biz.lng! },
        title: biz.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 11 : 7,
          fillColor: isSelected ? "#1B6B4F" : "#3568B2",
          fillOpacity: isSelected ? 1 : 0.85,
          strokeColor: "#ffffff",
          strokeWeight: isSelected ? 3 : 2,
        },
        zIndex: isSelected ? 10 : 1,
      });

      marker.addListener("click", () => {
        onPinClick?.(biz.id);

        // Open info window
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(buildInfoWindowContent(biz));
          infoWindowRef.current.open(mapRef.current, marker);
        }

        mapRef.current?.panTo({ lat: biz.lat!, lng: biz.lng! });
      });

      markersRef.current.set(biz.id, marker);
      newMarkers.push(marker);
    });

    // Cluster overlapping markers
    clustererRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers: newMarkers,
    });

    // Auto-fit bounds on first load / filter change
    if (valid.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      valid.forEach((b) => bounds.extend({ lat: b.lat!, lng: b.lng! }));
      mapRef.current.fitBounds(bounds, { padding: 60 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, mapReady]);


  // Update selected marker style without full redraw
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google;
    if (!google) return;

    markersRef.current.forEach((marker, id) => {
      const isSelected = id === selectedId;
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 11 : 7,
        fillColor: isSelected ? "#1B6B4F" : "#3568B2",
        fillOpacity: isSelected ? 1 : 0.85,
        strokeColor: "#ffffff",
        strokeWeight: isSelected ? 3 : 2,
      });
      marker.setZIndex(isSelected ? 10 : 1);

      if (isSelected && mapRef.current) {
        const pos = marker.getPosition();
        if (pos) mapRef.current.panTo(pos);
      }
    });
  }, [selectedId]);

  const handleMyLocation = useCallback(() => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        if (!mapRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const google = (window as any).google;

        // Remove old location markers
        myLocationMarkerRef.current?.setMap(null);
        myLocationCircleRef.current?.setMap(null);

        // Accuracy ring
        myLocationCircleRef.current = new google.maps.Circle({
          center: { lat, lng },
          radius: Math.min(accuracy, 5000),
          map: mapRef.current,
          fillColor: "#4285F4",
          fillOpacity: 0.08,
          strokeColor: "#4285F4",
          strokeOpacity: 0.25,
          strokeWeight: 1,
          zIndex: 0,
        });

        // Blue dot
        myLocationMarkerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          title: "Your location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 999,
        });

        const locInfoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#111218;padding:2px 4px">📍 You are here</div>`,
        });
        myLocationMarkerRef.current.addListener("click", () =>
          locInfoWindow.open(mapRef.current, myLocationMarkerRef.current)
        );

        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(11);
        setHasLocation(true);

        // Tell parent so it can sort by distance
        onLocationChange?.(lat, lng);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocError("Location access denied. Allow it in your browser settings.");
        else setLocError("Couldn't get your location. Try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationChange]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: "500px" }}>
      {/* Map */}
      <div
        ref={containerRef}
        className="w-full h-full rounded-[var(--r-xl)] overflow-hidden border border-border"
        style={{ minHeight: "500px" }}
      />

      {/* My Location button */}
      <button
        onClick={handleMyLocation}
        disabled={locating}
        title={hasLocation ? "Update my location" : "Show my location on map"}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 pl-3 pr-4 py-2 rounded-full shadow-[var(--shadow-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: hasLocation ? "#1B6B4F" : "rgba(255,255,255,0.97)",
          color: hasLocation ? "#ffffff" : "#2C2F36",
          border: hasLocation ? "none" : "1px solid #E8EAED",
          backdropFilter: "blur(10px)",
        }}
      >
        {locating ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Locating…
          </>
        ) : (
          <>
            {hasLocation ? (
              // Active state — filled circle icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
            {hasLocation ? "Near Me" : "My Location"}
          </>
        )}
      </button>

      {/* Businesses count badge */}
      {businesses.filter(b => b.lat != null).length > 0 && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#2C2F36]"
          style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #E8EAED", backdropFilter: "blur(8px)" }}>
          {businesses.filter(b => b.lat != null).length} on map
        </div>
      )}

      {/* Error toast */}
      {locError && (
        <div className="absolute bottom-14 right-4 z-10 max-w-[260px] px-3 py-2 rounded-[var(--r-md)] text-[12px] leading-snug shadow-[var(--shadow-sm)] flex items-start gap-2"
          style={{ background: "#FDF0EE", border: "1px solid rgba(179,59,46,0.2)", color: "#B33B2E" }}>
          <span className="flex-1">{locError}</span>
          <button onClick={() => setLocError(null)} className="opacity-60 hover:opacity-100 shrink-0">✕</button>
        </div>
      )}
    </div>
  );
}
