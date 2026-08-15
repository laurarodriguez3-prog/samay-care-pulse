import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { HOSPITAL, wellnessActivities } from "@/lib/samay-data";

type Msg = { role: "bot" | "user"; text: string; cards?: boolean };

const quick = [
  { key: "bienestar", label: "🌿 Actividades de bienestar" },
  { key: "pausas", label: "🧘 Pausas activas" },
  { key: "institucional", label: "📅 Actividades institucionales" },
  { key: "apoyo", label: "💚 Recursos de apoyo" },
  { key: "ayuda", label: "❓ Ayuda" },
];

function answer(input: string): Msg {
  const t = input.toLowerCase();
  if (t.includes("bienestar"))
    return {
      role: "bot",
      text: `Estas son algunas actividades y recursos de bienestar disponibles. Puedes consultar las actividades programadas por el ${HOSPITAL.name}.`,
      cards: true,
    };
  if (t.includes("pausa"))
    return {
      role: "bot",
      text: "Las pausas activas son ejercicios breves de 5 a 10 minutos durante la jornada: respiración guiada, movilidad de cuello y hombros, y estiramientos de espalda. Se recomiendan especialmente en los horarios críticos de cada servicio.",
      cards: true,
    };
  if (t.includes("institucional") || t.includes("calendario") || t.includes("taller"))
    return {
      role: "bot",
      text: "Las actividades institucionales se publican en el calendario interno del instituto: talleres, campañas de salud ocupacional y jornadas de bienestar. Puedes consultar el calendario con tu área de Salud Ocupacional.",
      cards: true,
    };
  if (t.includes("apoyo") || t.includes("recurso") || t.includes("ocupacional"))
    return {
      role: "bot",
      text: "Recursos de apoyo disponibles: orientación de Salud Ocupacional, canales de acompañamiento al personal, guías de manejo de carga laboral y espacios de descanso. Si necesitas atención prioritaria, comunícate con tu jefatura de servicio.",
    };
  if (t.includes("irso"))
    return {
      role: "bot",
      text: "El IRSO es el Índice de Riesgo de Sobrecarga Organizacional (0 a 100). Es un indicador preventivo a nivel de servicio: no diagnostica burnout ni evalúa individualmente a los trabajadores.",
    };
  if (t.includes("mapa") || t.includes("dashboard") || t.includes("tiempo"))
    return {
      role: "bot",
      text: "Puedes explorar el Mapa de Calor para ver el riesgo por servicio, el Dashboard para el análisis general y la Línea de Tiempo para entender cuándo comenzó el incremento del riesgo.",
    };
  return {
    role: "bot",
    text: "Puedo orientarte sobre actividades de bienestar, pausas activas, actividades institucionales, recursos de apoyo y el uso de la plataforma. Elige una opción rápida o escríbeme tu consulta.",
  };
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hola 👋 Soy Samay Care. ¿En qué puedo ayudarte?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, answer(text)]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir Samay Care Assistant"
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full cta-gradient shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[85vh] w-full flex-col overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] sm:bottom-5 sm:right-5 sm:h-[560px] sm:w-[380px] sm:rounded-2xl">
          <div className="flex items-center justify-between cta-gradient px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold">Samay Care Assistant</p>
              <p className="text-[11px] opacity-90">Orientación y soporte · datos demostrativos</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={
                    m.role === "user"
                      ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                      : "w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2 text-sm text-secondary-foreground"
                  }
                >
                  {m.text}
                </div>
                {m.cards && (
                  <div className="mt-2 space-y-2">
                    {wellnessActivities.map((a) => (
                      <div key={a.title} className="surface-card p-3">
                        <p className="text-sm font-semibold text-deep">
                          {a.icon} {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{a.meta}</p>
                        <div className="mt-2 flex gap-2">
                          <button className="rounded-full bg-sky-soft px-3 py-1 text-[11px] font-medium text-deep">
                            Ver detalles
                          </button>
                          <button className="rounded-full bg-leaf-soft px-3 py-1 text-[11px] font-medium text-deep">
                            Agregar a calendario
                          </button>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground">
                      Información demostrativa para el MVP. No corresponde a eventos reales.
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-card px-3 pb-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quick.map((q) => (
                <button
                  key={q.key}
                  onClick={() => send(q.label)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-deep transition-colors hover:bg-sky-soft"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full cta-gradient"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
