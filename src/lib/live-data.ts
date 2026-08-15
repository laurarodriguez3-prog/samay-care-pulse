import { useEffect, useState } from "react";
import {
  demandData,
  irsoEvolution,
  irsoVariables,
  reportTrend,
  services,
  wellnessWorkshops,
  type Service,
} from "@/lib/samay-data";
import { useSimulation } from "@/lib/simulation";

const zeroServices: Service[] = services.map((s) => ({
  ...s,
  irso: 0,
  trend: 0,
  risk: "bajo",
  criticalHours: "—",
  factors: ["Sin datos: inicia la simulación"],
}));

const zeroIrsoVariables = irsoVariables.map((v) => ({ ...v, value: 0 }));
const zeroIrsoEvolution = irsoEvolution.map((d) => ({ ...d, irso: 0 }));
const zeroDemand = demandData.map((d) => ({
  ...d,
  atenciones: 0,
  ausencias: 0,
  incidencias: 0,
}));
const zeroReportTrend = reportTrend.map((d) => ({ ...d, reportes: 0 }));
const zeroWorkshops = wellnessWorkshops.map((w) => ({
  ...w,
  startParticipants: 0,
  activeParticipants: 0,
  avgAttendance: 0,
  dropoutRate: 0,
  retention30: 0,
  sessions: w.sessions.map((s) => ({ ...s, participantes: 0 })),
}));

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useLiveData() {
  const { active } = useSimulation();
  const hydrated = useHydrated();
  const live = active && hydrated;
  const liveServices = live ? services : zeroServices;
  return {
    active,
    services: liveServices,
    irsoVariables: live ? irsoVariables : zeroIrsoVariables,
    irsoEvolution: live ? irsoEvolution : zeroIrsoEvolution,
    demandData: live ? demandData : zeroDemand,
    reportTrend: live ? reportTrend : zeroReportTrend,
    wellnessWorkshops: live ? wellnessWorkshops : zeroWorkshops,
    riskByService: liveServices.map((s) => ({ servicio: s.name, irso: s.irso })),
  };
}

export function useLiveService(id: string): Service {
  const { services: list } = useLiveData();
  return list.find((s) => s.id === id) ?? list[0]!;
}
