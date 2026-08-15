import { riskColor, riskLabel, type RiskLevel } from "@/lib/samay-data";

export function IrsoGauge({
  value,
  level,
  size = 200,
}: {
  value: number;
  level: RiskLevel;
  size?: number;
}) {
  const stroke = size * 0.09;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = riskColor[level];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-semibold text-deep">{value}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
        <span
          className="mt-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ color }}
        >
          {riskLabel[level]}
        </span>
      </div>
    </div>
  );
}
