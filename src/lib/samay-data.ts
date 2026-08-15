export type RiskLevel = "alto" | "moderado" | "bajo";

export type Service = {
  id: string;
  name: string;
  icon: string;
  irso: number;
  risk: RiskLevel;
  trend: number;
  criticalHours: string;
  factors: string[];
  position: { lat: number; lng: number };
};

export const HOSPITAL = {
  name: "Instituto Nacional de Salud del Niño San Borja",
  address: "Av. Javier Prado Este 3101, Lima 15037, Perú",
  lat: -12.0854256,
  lng: -76.9920275,
};


export const services: Service[] = [
  {
    id: "emergencias",
    name: "Emergencias",
    icon: "🚑",
    irso: 82,
    risk: "alto",
    trend: 12,
    criticalHours: "18:00 — 22:00",
    factors: [
      "Alta demanda",
      "Acumulación de turnos",
      "Baja recuperación",
      "Incremento de incidencias",
    ],
    position: { lat: -12.0848, lng: -76.9927 },
  },
  {
    id: "hospitalizacion",
    name: "Hospitalización",
    icon: "🏥",
    irso: 64,
    risk: "moderado",
    trend: 5,
    criticalHours: "14:00 — 18:00",
    factors: ["Ocupación sostenida de camas", "Rotación de personal", "Carga administrativa"],
    position: { lat: -12.0859, lng: -76.9914 },
  },
  {
    id: "consultorios",
    name: "Consultorios",
    icon: "👨‍⚕️",
    irso: 38,
    risk: "bajo",
    trend: -4,
    criticalHours: "09:00 — 11:00",
    factors: ["Demanda estable", "Distribución equilibrada de tareas"],
    position: { lat: -12.0846, lng: -76.9911 },
  },
  {
    id: "uci",
    name: "UCI",
    icon: "❤️",
    irso: 71,
    risk: "moderado",
    trend: 8,
    criticalHours: "22:00 — 02:00",
    factors: ["Turnos nocturnos prolongados", "Alta complejidad", "Baja recuperación"],
    position: { lat: -12.0862, lng: -76.9926 },
  },
];

export const riskLabel: Record<RiskLevel, string> = {
  alto: "Riesgo alto",
  moderado: "Riesgo moderado",
  bajo: "Riesgo bajo",
};

export const riskDot: Record<RiskLevel, string> = {
  alto: "🔴",
  moderado: "🟡",
  bajo: "🟢",
};

export const riskColor: Record<RiskLevel, string> = {
  alto: "var(--risk-high)",
  moderado: "var(--risk-mid)",
  bajo: "var(--risk-low)",
};

export const irsoVariables = [
  { name: "Carga de trabajo", value: 86 },
  { name: "Duración de turnos", value: 78 },
  { name: "Demanda", value: 81 },
  { name: "Ausentismo", value: 64 },
  { name: "Recuperación", value: 42 },
  { name: "Incidencias", value: 70 },
  { name: "Distribución de tareas", value: 58 },
];

export const irsoEvolution = [
  { fecha: "01 Ago", irso: 61 },
  { fecha: "03 Ago", irso: 63 },
  { fecha: "05 Ago", irso: 68 },
  { fecha: "07 Ago", irso: 70 },
  { fecha: "09 Ago", irso: 75 },
  { fecha: "11 Ago", irso: 79 },
  { fecha: "12 Ago", irso: 82 },
];

export const riskByService = services.map((s) => ({ servicio: s.name, irso: s.irso }));

export const demandData = [
  { fecha: "01 Ago", atenciones: 320, ausencias: 8, incidencias: 4 },
  { fecha: "03 Ago", atenciones: 355, ausencias: 10, incidencias: 5 },
  { fecha: "05 Ago", atenciones: 402, ausencias: 12, incidencias: 6 },
  { fecha: "07 Ago", atenciones: 388, ausencias: 15, incidencias: 7 },
  { fecha: "09 Ago", atenciones: 431, ausencias: 17, incidencias: 9 },
  { fecha: "11 Ago", atenciones: 468, ausencias: 19, incidencias: 12 },
  { fecha: "12 Ago", atenciones: 486, ausencias: 21, incidencias: 14 },
];

export const reportTrend = [
  { fecha: "01 Ago", reportes: 6 },
  { fecha: "03 Ago", reportes: 9 },
  { fecha: "05 Ago", reportes: 11 },
  { fecha: "07 Ago", reportes: 14 },
  { fecha: "09 Ago", reportes: 18 },
  { fecha: "11 Ago", reportes: 22 },
  { fecha: "12 Ago", reportes: 27 },
];

export type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
  irso: number;
  level: RiskLevel;
  range: 7 | 30 | 90;
};

export const timeline: TimelineEvent[] = [
  {
    date: "15 May",
    title: "Línea base establecida",
    detail: "Inicio del monitoreo preventivo en los servicios priorizados.",
    irso: 48,
    level: "bajo",
    range: 90,
  },
  {
    date: "20 Jun",
    title: "Estacionalidad respiratoria",
    detail: "Incremento gradual de atenciones pediátricas.",
    irso: 55,
    level: "bajo",
    range: 90,
  },
  {
    date: "18 Jul",
    title: "Reprogramación de turnos",
    detail: "Ajustes en la distribución de tareas del turno noche.",
    irso: 58,
    level: "bajo",
    range: 30,
  },
  {
    date: "01 Ago",
    title: "IRSO Emergencias: 61",
    detail: "Indicadores dentro de rango esperado.",
    irso: 61,
    level: "moderado",
    range: 7,
  },
  {
    date: "05 Ago",
    title: "Aumento de demanda",
    detail: "Crecimiento sostenido de atenciones en horario tarde-noche.",
    irso: 68,
    level: "moderado",
    range: 7,
  },
  {
    date: "09 Ago",
    title: "Aumento de acumulación de turnos",
    detail: "Menor tiempo de recuperación entre jornadas.",
    irso: 75,
    level: "moderado",
    range: 7,
  },
  {
    date: "12 Ago",
    title: "Incremento de incidencias",
    detail: "Se activa alerta preventiva para el servicio de Emergencias.",
    irso: 82,
    level: "alto",
    range: 7,
  },
];

export const wellnessActivities = [
  { title: "Pausa activa", meta: "Duración: 10 min", icon: "🧘" },
  { title: "Taller de bienestar", meta: "Fecha: Próximamente", icon: "🌿" },
  { title: "Actividad institucional", meta: "Consultar calendario", icon: "📅" },
];
