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


      <section className="surface-card mt-8 p-5">
        <h2 className="font-display text-lg font-semibold text-deep">
          Cargos que más respondieron
        </h2>
        <p className="text-xs text-muted-foreground">
          Ranking de consultas al asistente según el cargo declarado en el chatbot.
        </p>

        <ul className="mt-4 space-y-3">
          {ranking.map((r, i) => (
            <li key={r.key} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-xs font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-sm text-deep">
                  <span className="truncate">
                    {roleIcons[r.key]} {roleLabels[r.key]}
                  </span>
                  <span className="shrink-0 font-display font-semibold">{r.value}</span>
                </span>
                <span className="mt-1 block h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-primary transition-all"
                    style={{ width: `${maxRole ? (r.value / maxRole) * 100 : 0}%` }}
                  />
                </span>
              </span>
            </li>
          ))}
        </ul>

        {maxRole === 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            Aún no hay respuestas registradas: inicia la simulación y consulta al chatbot.
          </p>
        )}
      </section>


      <p className="mt-8 text-xs text-muted-foreground">
        Datos demostrativos para el MVP de Samay Care.
      </p>
    </div>
  );
}
