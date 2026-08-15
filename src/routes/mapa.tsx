import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HospitalMap } from "@/components/HospitalMap";
import { ServiceCards } from "@/components/ServiceCards";
import { IrsoGauge } from "@/components/IrsoGauge";
import { services } from "@/lib/samay-data";
import { useLiveData } from "@/lib/live-data";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Bienestar Hospitalario | Samay Care" },
      {
        name: "description",
        content:
          "Mapa interactivo de riesgo de sobrecarga por servicio hospitalario con indicadores IRSO en tiempo real.",
      },
      { property: "og:title", content: "Mapa de Bienestar Hospitalario | Samay Care" },
      {
        property: "og:description",
        content: "Visualiza el riesgo de sobrecarga organizacional por servicio hospitalario.",
      },
    ],
  }),
  component: MapaPage,
});

function MapaPage() {
  const [selectedId, setSelectedId] = useState<string>(services[0]!.id);
  const { services: liveServices, irsoVariables } = useLiveData();
  const selected = liveServices.find((s) => s.id === selectedId) ?? liveServices[0]!;
  const setSelected = (s: { id: string }) => setSelectedId(s.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Mapa de calor</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
          Mapa de Bienestar Hospitalario
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Selecciona un servicio para ver su nivel de riesgo, IRSO, tendencia, horario crítico y
          principales factores detectados. Datos demostrativos.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[65%_1fr]">
          <HospitalMap selected={selected} onSelect={setSelected} />
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-deep">Servicios</h2>
            <ServiceCards selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </section>

      <section className="mt-16 surface-card p-6 sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center">
            <IrsoGauge value={selected.irso} level={selected.risk} size={220} />
            <p className="mt-3 text-sm font-medium text-deep">
              {selected.icon} {selected.name}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-deep">
              Índice de Riesgo de Sobrecarga Organizacional
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              El IRSO es un indicador preventivo que permite identificar condiciones organizacionales
              asociadas a sobrecarga. No diagnostica burnout ni evalúa individualmente a los
              trabajadores.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {irsoVariables.map((v) => (
                <div key={v.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-deep">{v.name}</span>
                    <span className="text-muted-foreground">{v.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-sky"
                      style={{ width: `${v.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
