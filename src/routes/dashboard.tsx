import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IrsoGauge } from "@/components/IrsoGauge";
import { riskColor } from "@/lib/samay-data";
import { useLiveData } from "@/lib/live-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard de Bienestar | Samay Care" },
      {
        name: "description",
        content:
          "Análisis del IRSO general, servicios en riesgo, demanda, ausencias e incidencias hospitalarias.",
      },
      { property: "og:title", content: "Dashboard de Bienestar | Samay Care" },
      {
        property: "og:description",
        content: "Evolución del riesgo de sobrecarga organizacional en el entorno hospitalario.",
      },
    ],
  }),
  component: DashboardPage,
});

const activeKpis = [
  { label: "IRSO General", value: "68/100", note: "🟡 Riesgo moderado" },
  { label: "Servicios monitoreados", value: "12", note: "Cobertura activa" },
  { label: "Servicios en riesgo alto", value: "3", note: "🔴 Requieren atención" },
  { label: "Alertas preventivas", value: "7", note: "Últimos 7 días" },
  { label: "Tendencia general", value: "↑ 8%", note: "vs. semana anterior" },
];

const zeroKpis = [
  { label: "IRSO General", value: "0/100", note: "Simulación no iniciada" },
  { label: "Servicios monitoreados", value: "0", note: "Sin cobertura activa" },
  { label: "Servicios en riesgo alto", value: "0", note: "Sin alertas" },
  { label: "Alertas preventivas", value: "0", note: "Últimos 7 días" },
  { label: "Tendencia general", value: "0%", note: "vs. semana anterior" },
];

const chartCard = "surface-card p-5";

function ChartTooltip() {
  return (
    <Tooltip
      contentStyle={{
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--card)",
        fontSize: 12,
      }}
    />
  );
}

function DashboardPage() {
  const {
    active,
    services,
    irsoEvolution,
    demandData,
    reportTrend,
    riskByService,
  } = useLiveData();
  const kpis = active ? activeKpis : zeroKpis;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Análisis</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
        Dashboard de Bienestar
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Indicadores preventivos consolidados del entorno hospitalario. Datos demostrativos.
      </p>
      {!active && (
        <p className="mt-4 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
          Todos los índices están en 0. Pulsa “Iniciar simulación” en el menú superior para cargar
          los datos.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="surface-card p-5">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-deep">{k.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="surface-card flex flex-col items-center justify-center p-6">
          <IrsoGauge value={active ? 68 : 0} level={active ? "moderado" : "bajo"} size={200} />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            IRSO general del establecimiento
          </p>
        </div>

        <div className={`${chartCard} lg:col-span-2`}>
          <h2 className="font-display text-base font-semibold text-deep">Evolución del IRSO</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={irsoEvolution} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="irsoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--sky)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--sky)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Area
                type="monotone"
                dataKey="irso"
                stroke="var(--sky)"
                strokeWidth={2.5}
                fill="url(#irsoFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={chartCard}>
          <h2 className="font-display text-base font-semibold text-deep">Riesgo por servicio</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskByService} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="servicio" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Bar dataKey="irso" radius={[8, 8, 0, 0]}>
                {services.map((s) => (
                  <Cell key={s.id} fill={riskColor[s.risk]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={chartCard}>
          <h2 className="font-display text-base font-semibold text-deep">Demanda hospitalaria</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={demandData} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Line
                type="monotone"
                dataKey="atenciones"
                stroke="var(--sky)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={chartCard}>
          <h2 className="font-display text-base font-semibold text-deep">Ausencias</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demandData} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Bar dataKey="ausencias" fill="var(--leaf)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={chartCard}>
          <h2 className="font-display text-base font-semibold text-deep">Incidencias</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={demandData} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--leaf)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--leaf)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Area
                type="monotone"
                dataKey="incidencias"
                stroke="var(--leaf)"
                strokeWidth={2.5}
                fill="url(#incFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${chartCard} lg:col-span-2`}>
          <h2 className="font-display text-base font-semibold text-deep">Tendencia de reportes</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={reportTrend} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              {ChartTooltip()}
              <Line
                type="monotone"
                dataKey="reportes"
                stroke="var(--deep)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
