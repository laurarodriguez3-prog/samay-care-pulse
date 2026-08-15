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

const topicOrder: TopicKey[] = [
  "bienestar",
  "pausas",
  "institucional",
  "apoyo",
  "ayuda",
  "plataforma",
];

const timeFmt = (at: number) =>
  new Date(at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

function TimelinePage() {
  const [range, setRange] = useState<(typeof filters)[number]>(7);
  const events = timeline.filter((e) => e.range <= range);
  const sim = useSimulation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Evolución</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
        Línea de Tiempo
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Cómo evolucionaron los indicadores y en qué momento se activaron las señales preventivas.
      </p>

      <section className="surface-card mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-deep">
              Registro de la simulación
            </h2>
            <p className="text-xs text-muted-foreground">
              {sim.active
                ? "Simulación activa · los contadores suman con cada consulta al asistente."
                : "Simulación no iniciada · todos los contadores están en 0."}
            </p>
          </div>
          {!sim.active && (
            <button
              onClick={startSimulation}
              className="rounded-full cta-gradient px-4 py-2 text-xs font-semibold"
            >
              Iniciar simulación
            </button>
          )}
        </div>

        <div className="mt-4 rounded-xl bg-sky-soft px-4 py-3">
          <p className="text-xs font-medium text-deep">Usos del chatbot</p>
          <p className="font-display text-3xl font-semibold text-deep">{sim.chatbotUses}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {topicOrder.map((k) => (
            <div key={k} className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">
                {topicIcons[k]} {topicLabels[k]}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-deep">{sim.counts[k]}</p>
              <p className="text-[11px] text-muted-foreground">
                {sim.counts[k] === 1 ? "consulta" : "consultas"}
              </p>
            </div>
          ))}
        </div>

        {sim.events.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-border pt-4">
            {sim.events.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-deep">
                  {topicIcons[e.topic]} <span className="font-medium">{topicLabels[e.topic]}</span>{" "}
                  <span className="text-muted-foreground">· {e.query}</span>
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {e.via === "voz" ? "🎙️ " : ""}
                  {timeFmt(e.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>


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
