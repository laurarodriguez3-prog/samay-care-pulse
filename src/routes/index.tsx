import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, BarChart3, ShieldCheck, Waves } from "lucide-react";
import logo from "@/assets/samay-care-logo.png.asset.json";
import recolectarIllustration from "@/assets/recolectar-illustration.jpg.asset.json";
import { HospitalMap } from "@/components/HospitalMap";
import { ServiceCards } from "@/components/ServiceCards";
import { IrsoGauge } from "@/components/IrsoGauge";
import { irsoVariables, services, type Service } from "@/lib/samay-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samay Care | Prevención de la sobrecarga hospitalaria" },
      {
        name: "description",
        content:
          "Plataforma inteligente para la detección y prevención de la sobrecarga organizacional en entornos hospitalarios.",
      },
      { property: "og:title", content: "Samay Care | Cuidar a quienes cuidan" },
      {
        property: "og:description",
        content:
          "Inteligencia preventiva que transforma datos hospitalarios en señales de cuidado.",
      },
    ],
  }),
  component: Index,
});

const steps = [
  {
    n: "01",
    title: "Recolectar",
    icon: Waves,
    text: "Samay Care utiliza información disponible del entorno hospitalario, como demanda de atención, turnos, carga de trabajo, ausencias e incidencias.",
    image: recolectarIllustration.url,
  },
  {
    n: "02",
    title: "Analizar",
    icon: BarChart3,
    text: "La plataforma analiza tendencias y genera indicadores de riesgo para cada servicio.",
  },
  {
    n: "03",
    title: "Detectar",
    icon: Activity,
    text: "Identifica qué áreas presentan mayor presión y en qué momentos se concentra el riesgo.",
  },
  {
    n: "04",
    title: "Prevenir",
    icon: ShieldCheck,
    text: "Genera información y recomendaciones que ayudan a los responsables a tomar acciones preventivas.",
  },
];

function Index() {
  const [selected, setSelected] = useState<Service>(services[0]!);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden hero-bg">
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-70"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,192 C240,96 480,288 720,224 C960,160 1200,64 1440,144 L1440,320 L0,320 Z"
            fill="color-mix(in oklab, var(--sky) 14%, transparent)"
          />
          <path
            d="M0,240 C260,160 520,320 780,256 C1040,192 1240,128 1440,192 L1440,320 L0,320 Z"
            fill="color-mix(in oklab, var(--leaf) 14%, transparent)"
          />
        </svg>
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-leaf-soft breathe" />
        <div className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-sky-soft breathe" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <img
            src={logo.url}
            alt="Logo Samay Care"
            className="h-32 w-32 rounded-full object-cover shadow-[var(--shadow-soft)] sm:h-40 sm:w-40"
          />
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground sm:text-base">
            “Plataforma Inteligente para la Detección y Prevención de la Sobrecarga Organizacional en
            Entornos Hospitalarios”
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-3xl font-semibold leading-tight text-deep sm:text-5xl">
            Porque cuidar empieza por quienes cuidan.
          </h1>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/mapa"
              className="rounded-full cta-gradient px-7 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
            >
              Explorar plataforma
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-deep transition-colors hover:bg-sky-soft"
            >
              ¿Cómo funciona?
            </a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Proceso</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
            ¿Cómo funciona Samay Care?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Samay Care transforma datos hospitalarios y señales de bienestar en información preventiva
            para ayudar a identificar servicios que podrían estar experimentando una sobrecarga.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          {["Datos", "Análisis", "Detección", "Prevención"].map((label, i) => (
            <span key={label} className="flex items-center gap-2">
              <span className="rounded-full bg-sky-soft px-3 py-1.5 text-deep">{label}</span>
              {i < 3 && <span className="text-primary">→</span>}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <article key={s.n} className="surface-card p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl font-semibold text-sky">{s.n}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-deep">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Mapa de calor
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-deep sm:text-4xl">
            Mapa de Bienestar Hospitalario
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Selecciona un servicio para actualizar la información del mapa. Datos demostrativos.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[65%_1fr]">
            <HospitalMap selected={selected} onSelect={setSelected} />
            <ServiceCards selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </section>

      {/* IRSO */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="surface-card grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <IrsoGauge value={selected.irso} level={selected.risk} size={230} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-deep sm:text-3xl">
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
                    <div className="h-full rounded-full bg-sky" style={{ width: `${v.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="relative overflow-hidden hero-bg py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-deep sm:text-4xl">
            Porque cuidar empieza por quienes cuidan.
          </h2>
          <p className="mt-6 font-display text-lg font-semibold tracking-tight text-primary">
            SAMAY CARE
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            “Inteligencia preventiva para transformar datos en cuidado.”
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex rounded-full cta-gradient px-7 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
          >
            Explorar el Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
