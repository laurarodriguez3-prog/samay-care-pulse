import { riskColor, riskDot, riskLabel, type Service } from "@/lib/samay-data";
import { useLiveData } from "@/lib/live-data";

export function ServiceCards({
  selected,
  onSelect,
}: {
  selected: Service;
  onSelect: (s: Service) => void;
}) {
  const { services } = useLiveData();
  return (
    <div className="flex flex-col gap-3">
      {services.map((s) => {
        const active = s.id === selected.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`surface-card w-full p-4 text-left transition-all hover:-translate-y-0.5 ${
              active ? "ring-2 ring-primary/60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-deep">
                  {s.icon} {s.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {riskDot[s.risk]} {riskLabel[s.risk]}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-semibold" style={{ color: riskColor[s.risk] }}>
                  {s.irso}
                </p>
                <p className="text-[11px] text-muted-foreground">IRSO</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.irso}%`, background: riskColor[s.risk] }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tendencia{" "}
              <span className="font-semibold" style={{ color: riskColor[s.risk] }}>
                {s.trend > 0 ? "↑" : "↓"} {Math.abs(s.trend)}%
              </span>
            </p>
          </button>
        );
      })}
    </div>
  );
}
