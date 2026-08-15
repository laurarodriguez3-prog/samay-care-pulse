import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/samay-care-logo.png.asset.json";
import { startSimulation, stopSimulation, useSimulation } from "@/lib/simulation";

const links = [
  { to: "/mapa", label: "Mapa de Calor" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/linea-de-tiempo", label: "Línea de Tiempo" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const sim = useSimulation();
  const toggleSim = () => (sim.active ? stopSimulation() : startSimulation());
  const simLabel = sim.active ? "Reiniciar simulación" : "Iniciar simulación";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt="Isotipo Samay Care"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-deep">
            SAMAY <span className="text-primary">CARE</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sky-soft hover:text-deep"
              activeProps={{ className: "bg-sky-soft text-deep" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSim}
            className="hidden rounded-full cta-gradient px-5 py-2 text-sm font-semibold shadow-[var(--shadow-card)] transition-opacity hover:opacity-90 md:inline-flex"
          >
            {simLabel}
          </button>
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-deep md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-sky-soft hover:text-deep"
                activeProps={{ className: "bg-sky-soft text-deep" }}
              >
                {l.label}
              </Link>
            ))}
            <button className="mt-2 rounded-full cta-gradient px-5 py-3 text-sm font-semibold">
              Ingresar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
