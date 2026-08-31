import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Leaflet + OpenStreetMap tiles — free, no API key needed (unlike Google
// Maps, which needs a billing-enabled Cloud project — see the Flutter
// repo's CLAUDE.md for that exact unresolved gap on the guest-side Search
// map). Tap/drag the pin to set the listing's coordinates.
const HYDERABAD_CENTER: [number, number] = [17.385, 78.4867];

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#D6006D;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

export function MapPinPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const start: [number, number] = lat != null && lng != null ? [lat, lng] : HYDERABAD_CENTER;
    const map = L.map(containerRef.current, { attributionControl: false }).setView(start, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(start, { draggable: true, icon: pinIcon }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange(pos.lat, pos.lng);
    });
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // If no initial position was given, report the default center so the
    // draft has coordinates even before the user touches the map.
    if (lat == null || lng == null) onChange(start[0], start[1]);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-pink-tint">
      <div ref={containerRef} className="h-48 w-full" />
    </div>
  );
}
