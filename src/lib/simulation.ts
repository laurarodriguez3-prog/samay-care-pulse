import { useSyncExternalStore } from "react";

export type TopicKey = "bienestar" | "pausas" | "institucional" | "apoyo" | "ayuda" | "plataforma";

export const topicLabels: Record<TopicKey, string> = {
  bienestar: "Actividades de bienestar",
  pausas: "Pausas activas",
  institucional: "Actividades institucionales",
  apoyo: "Recursos de apoyo",
  ayuda: "Ayuda",
  plataforma: "Uso de la plataforma",
};

export const topicIcons: Record<TopicKey, string> = {
  bienestar: "🌿",
  pausas: "🧘",
  institucional: "📅",
  apoyo: "💚",
  ayuda: "❓",
  plataforma: "🧭",
};

export type SimEvent = {
  id: string;
  at: number;
  topic: TopicKey;
  query: string;
  via: "texto" | "voz";
};

export type SimState = {
  active: boolean;
  startedAt: number | null;
  chatbotUses: number;
  counts: Record<TopicKey, number>;
  events: SimEvent[];
};

const STORAGE_KEY = "samay-simulation";

const emptyCounts = (): Record<TopicKey, number> => ({
  bienestar: 0,
  pausas: 0,
  institucional: 0,
  apoyo: 0,
  ayuda: 0,
  plataforma: 0,
});

export const initialState = (): SimState => ({
  active: false,
  startedAt: null,
  chatbotUses: 0,
  counts: emptyCounts(),
  events: [],
});

let state: SimState = initialState();
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SimState;
      state = { ...initialState(), ...parsed, counts: { ...emptyCounts(), ...parsed.counts } };
    }
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  listener();
  return () => listeners.delete(listener);
}

export function startSimulation() {
  state = { ...initialState(), active: true, startedAt: Date.now() };
  emit();
}

export function stopSimulation() {
  state = initialState();
  emit();
}

export function recordQuery(topic: TopicKey, query: string, via: "texto" | "voz") {
  state = {
    ...state,
    chatbotUses: state.chatbotUses + 1,
    counts: { ...state.counts, [topic]: state.counts[topic] + 1 },
    events: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        at: Date.now(),
        topic,
        query,
        via,
      },
      ...state.events,
    ].slice(0, 60),
  };
  emit();
}

export function useSimulation(): SimState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}
