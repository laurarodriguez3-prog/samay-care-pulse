import { useState } from "react";
import { riskColor, type Service, type WellnessWorkshop } from "@/lib/samay-data";
import { useLiveData } from "@/lib/live-data";

function retentionColor(retention: number) {
  if (retention < 30) return "var(--risk-high)";
  if (retention < 60) return "var(--risk-mid)";
  return "var(--risk-low)";
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string | undefined;
}) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-base font-semibold" style={{ color: color ?? "var(--deep)" }}>
        {value}
      </p>
    </div>
  );
}

function WorkshopCard({ w }: { w: WellnessWorkshop }) {
  const max = Math.max(1, ...w.sessions.map((s) => s.participantes));
  const color = retentionColor(w.retention30);
  return (
    <article className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-deep">
            {w.icon} {w.name}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Servicio con mayor inscripción: {w.service}
          </p>
        </div>
        <span
          className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ color, background: `color-mix(in oklab, ${color} 14%, transparent)` }}
        >
          Retención 30d {w.retention30}%
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Metric label="Participantes activos" value={`${w.activeParticipants}/${w.startParticipants}`} />
        <Metric label="Asistencia prom." value={`${w.avgAttendance}%`} />
        <Metric
          label="Abandono"
          value={`${w.dropoutRate}%`}
          color={w.dropoutRate > 60 ? "var(--risk-high)" : undefined}
        />
      </div>

      <div className="mt-3 flex items-end gap-2">
        {w.sessions.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">{s.participantes}</span>
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${8 + (s.participantes / max) * 44}px`,
                background: `color-mix(in oklab, ${color} 70%, transparent)`,
              }}
            />
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {w.retention30 < 30 && w.startParticipants > 0 && (
        <p className="mt-3 rounded-xl border border-border bg-background px-3 py-2 text-[11px] text-deep">
          ⚠️ Alerta de baja retención: comenzó con {w.startParticipants} participantes y hoy solo{" "}
          {w.activeParticipants}. Recomendación: ajustar horario y modalidad de la sesión.
        </p>
      )}
    </article>
  );
}

export function SanartePanel({
  selected,
  onSelect,
}: {
  selected: Service;
  onSelect?: (s: Service) => void;
}) {
  const { active, wellnessWorkshops: workshops, services: liveServices } = useLiveData();
  const [filter, setFilter] = useState<string>("todos");

  const shown = filter === "todos" ? workshops : workshops.filter((w) => w.service === filter);

  const totalActive = shown.reduce((a, w) => a + w.activeParticipants, 0);
  const totalStart = shown.reduce((a, w) => a + w.startParticipants, 0);
  const avgRetention = shown.length
    ? Math.round(shown.reduce((a, w) => a + w.retention30, 0) / shown.length)
    : 0;
  const avgAttendance = shown.length
    ? Math.round(shown.reduce((a, w) => a + w.avgAttendance, 0) / shown.length)
    : 0;

  const linked = workshops.filter((w) => w.service === selected.name);
  const lowParticipation = linked.some((w) => w.retention30 < 40);
  const crossAlert = active && selected.irso >= 65 && lowParticipation;

  const filterService = liveServices.find((s) => s.name === filter);

  return (
    <div className="flex flex-col gap-3">
      <div className="surface-card p-4">
        <p className="text-[11px] uppercase tracking-widest text-primary">Programa SANARTE</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-deep">
          Uso y sostenibilidad de las actividades de bienestar
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Yoga, Tejido, Impro, Escritura y Coro: participación, asistencia y permanencia en el tiempo.
        </p>

        <label className="mt-3 block text-[11px] uppercase tracking-wide text-muted-foreground">
          Servicio
        </label>
        <select
          value={filter}
          onChange={(e) => {
            const value = e.target.value;
            setFilter(value);
            const svc = liveServices.find((s) => s.name === value);
            if (svc) onSelect?.(svc);
          }}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-deep outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="todos">Todos los servicios</option>
          {liveServices.map((s) => (
            <option key={s.id} value={s.name}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>

        {filterService && (
          <p className="mt-2 text-xs text-muted-foreground">
            IRSO del servicio:{" "}
            <span className="font-semibold" style={{ color: riskColor[filterService.risk] }}>
              {filterService.irso}/100
            </span>{" "}
            · {shown.length} taller(es) SANARTE asociados
          </p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="Activos" value={`${totalActive}/${totalStart}`} />
          <Metric label="Asistencia prom." value={`${avgAttendance}%`} />
          <Metric
            label="Retención 30d"
            value={`${avgRetention}%`}
            color={retentionColor(avgRetention)}
          />
        </div>
      </div>

      {crossAlert && (
        <div
          className="surface-card p-4"
          style={{ borderColor: `color-mix(in oklab, ${riskColor[selected.risk]} 45%, transparent)` }}
        >
          <p className="text-sm font-semibold text-deep">
            🔎 Alta sobrecarga + baja participación · {selected.icon} {selected.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            IRSO {selected.irso}/100 con talleres de baja retención. Samay Care recomienda ajustar
            horario (turno tarde), modalidad (in situ o híbrida), duración (30 min) o cambiar el tipo
            de actividad.
          </p>
        </div>
      )}

      {shown.map((w) => (
        <WorkshopCard key={w.id} w={w} />
      ))}

      {!active && (
        <p className="text-xs text-muted-foreground">
          Todos los indicadores están en 0 hasta iniciar la simulación.
        </p>
      )}
    </div>
  );
}
