"use client";

import { useEffect, useRef } from "react";
import type { Business } from "@/components/business-card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DirectoryMapProps {
  businesses: Business[];
  selectedId?: string | null;
  onPinClick?: (id: string) => void;
}

export function DirectoryMap({
  businesses,
  selectedId,
  onPinClick,
}: DirectoryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [49.25, -123.1],  // Vancouver, BC
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when businesses change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const validBusinesses = businesses.filter(
      (b) => b.lat != null && b.lng != null
    );

    validBusinesses.forEach((biz) => {
      const isSelected = biz.id === selectedId;
      const marker = L.circleMarker([biz.lat!, biz.lng!], {
        radius: isSelected ? 10 : 7,
        fillColor: isSelected ? "#1D4ED8" : "#3568B2",
        color: isSelected ? "#1E3A5F" : "#ffffff",
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillOpacity: isSelected ? 0.9 : 0.7,
      });

      marker.bindTooltip(biz.name, {
        direction: "top",
        offset: [0, -8],
        className: "leaflet-tooltip-custom",
      });

      marker.on("click", () => {
        onPinClick?.(biz.id);
      });

      marker.addTo(map);
      markersRef.current.set(biz.id, marker);
    });

    // Fit bounds if we have markers
    if (validBusinesses.length > 0) {
      const group = L.featureGroup(Array.from(markersRef.current.values()));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [businesses, selectedId, onPinClick]);

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const isSelected = id === selectedId;
      marker.setStyle({
        radius: isSelected ? 10 : 7,
        fillColor: isSelected ? "#1D4ED8" : "#3568B2",
        color: isSelected ? "#1E3A5F" : "#ffffff",
        weight: isSelected ? 3 : 2,
        fillOpacity: isSelected ? 0.9 : 0.7,
      });
      if (isSelected) {
        marker.bringToFront();
      }
    });
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-[var(--r-xl)] overflow-hidden border border-border"
      style={{ minHeight: "500px" }}
    />
  );
}
