import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { riskColor, timeline } from "@/lib/samay-data";
import {
  startSimulation,
  topicIcons,
  topicLabels,
  useSimulation,
  type TopicKey,
} from "@/lib/simulation";

export const Route = createFileRoute("/linea-de-tiempo")({
  head: () => ({
    meta: [
      { title: "Línea de Tiempo del Riesgo | Samay Care" },
      {
        name: "description",
        content:
          "Evolución cronológica del IRSO y los eventos que anticiparon la sobrecarga en los servicios hospitalarios.",
      },
      { property: "og:title", content: "Línea de Tiempo del Riesgo | Samay Care" },
      {
        property: "og:description",
        content: "Comprende cuándo comenzó el incremento del riesgo de sobrecarga organizacional.",
      },
    ],
  }),
  component: TimelinePage,
});

const filters = [7, 30, 90] as const;

function TimelinePage() {
  const [range, setRange] = useState<(typeof filters)[number]>(7);
  const events = timeline.filter((e) => e.range <= range);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Evolución</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
        Línea de Tiempo
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Cómo evolucionaron los indicadores y en qué momento se activaron las señales preventivas.
      </p>

      <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setRange(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              range === f ? "cta-gradient" : "text-muted-foreground hover:text-deep"
            }`}
          >
            Últimos {f} días
          </button>
        ))}
      </div>

      <ol className="relative mt-10 border-l border-border pl-8">
        {events.map((e) => (
          <li key={e.date + e.title} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-background"
              style={{ background: riskColor[e.level] }}
            />
            <div className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {e.date}
                </p>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    color: riskColor[e.level],
                    background: `color-mix(in oklab, ${riskColor[e.level]} 14%, transparent)`,
                  }}
                >
                  IRSO {e.irso}
                </span>
              </div>
              <p className="mt-2 font-display text-base font-semibold text-deep">{e.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs text-muted-foreground">
        Datos demostrativos para el MVP de Samay Care.
      </p>
    </div>
  );
}
