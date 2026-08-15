import { useEffect, useRef, useState } from "react";
import { HOSPITAL, riskColor, services, type Service } from "@/lib/samay-data";

declare global {
  interface Window {
    google?: any;
    __samayMapInit?: () => void;
  }
}

const MAP_CALLBACK = "__samayMapInit";

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  const existing = document.getElementById("samay-gmaps");
  if (existing) {
    return new Promise((resolve) => {
      const prev = window.__samayMapInit;
      window.__samayMapInit = () => {
        prev?.();
        resolve();
      };
    });
  }
  return new Promise((resolve, reject) => {
    window.__samayMapInit = () => resolve();
    const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
    const channel = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID'];
    if (!key) {
      reject(new Error("missing key"));
      return;
    }
    const s = document.createElement("script");
    s.id = "samay-gmaps";
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=${MAP_CALLBACK}${
      channel ? `&channel=${channel}` : ""
    }`;
    s.onerror = () => reject(new Error("script error"));
    document.head.appendChild(s);
  });
}

export function HospitalMap({
  selected,
  onSelect,
}: {
  selected: Service;
  onSelect: (s: Service) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        const map = new window.google.maps.Map(ref.current, {
          center: { lat: HOSPITAL.lat, lng: HOSPITAL.lng },
          zoom: 17,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
          ],
        });
        mapRef.current = map;
        services.forEach((s) => {
          const marker = new window.google.maps.Marker({
            position: s.position,
            map,
            title: `${s.name} · IRSO ${s.irso}`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(riskColor[s.risk].replace("var(", "").replace(")", ""))
                .trim(),
              fillOpacity: 0.85,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
          });
          marker.addListener("click", () => onSelect(s));
          markersRef.current[s.id] = marker;
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo(selected.position);
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const icon = marker.getIcon();
      marker.setIcon({ ...icon, scale: id === selected.id ? 18 : 12 });
    });
  }, [selected]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-sky-soft lg:h-[560px]">
      <div ref={ref} className="h-full w-full" />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
          No se pudo cargar el mapa. Referencia: {HOSPITAL.name}.
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 max-w-[85%] rounded-xl border border-border bg-background/95 px-4 py-3 shadow-[var(--shadow-card)]">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Entorno hospitalario</p>
        <p className="text-sm font-semibold text-deep">{HOSPITAL.name}</p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-background/95 p-4 shadow-[var(--shadow-card)] sm:right-auto sm:w-80">
        <div className="flex items-center justify-between">
          <p className="font-display text-base font-semibold text-deep">
            {selected.icon} {selected.name}
          </p>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              color: riskColor[selected.risk],
              background: `color-mix(in oklab, ${riskColor[selected.risk]} 14%, transparent)`,
            }}
          >
            IRSO {selected.irso}/100
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Horario crítico: <span className="font-medium text-deep">{selected.criticalHours}</span> ·
          Tendencia{" "}
          <span className="font-medium text-deep">
            {selected.trend > 0 ? "↑" : "↓"} {Math.abs(selected.trend)}%
          </span>
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {selected.factors.map((f) => (
            <li
              key={f}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
