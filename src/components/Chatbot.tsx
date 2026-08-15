import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Square, X } from "lucide-react";
import { HOSPITAL, wellnessActivities } from "@/lib/samay-data";
import { recordQuery, type TopicKey } from "@/lib/simulation";

type Msg = { role: "bot" | "user"; text: string; cards?: boolean };

const quick = [
  { key: "bienestar", label: "🌿 Actividades de bienestar" },
  { key: "pausas", label: "🧘 Pausas activas" },
  { key: "institucional", label: "📅 Actividades institucionales" },
  { key: "apoyo", label: "💚 Recursos de apoyo" },
  { key: "ayuda", label: "❓ Ayuda" },
];

function classify(t: string): TopicKey {
  if (t.includes("pausa")) return "pausas";
  if (t.includes("institucional") || t.includes("calendario") || t.includes("taller"))
    return "institucional";
  if (t.includes("apoyo") || t.includes("recurso") || t.includes("ocupacional")) return "apoyo";
  if (t.includes("bienestar")) return "bienestar";
  if (
    t.includes("plataforma") ||
    t.includes("como funciona") ||
    t.includes("cómo funciona") ||
    t.includes("para que sirve") ||
    t.includes("para qué sirve") ||
    t.includes("samay") ||
    t.includes("irso") ||
    t.includes("mapa") ||
    t.includes("dashboard") ||
    t.includes("linea de tiempo") ||
    t.includes("línea de tiempo") ||
    t.includes("chatbot") ||
    t.includes("simulacion") ||
    t.includes("simulación")
  )
    return "plataforma";
  return "ayuda";
}

function answer(input: string): Msg {
  const t = input.toLowerCase();
  const topic = classify(t);

  if (topic === "plataforma") {
    if (t.includes("chatbot") || t.includes("asistente") || t.includes("voz"))
      return {
        role: "bot",
        text: "Puedes usar el asistente de dos formas: escribiendo tu consulta o pulsando el micrófono para hablar (tienes hasta 15 segundos y luego te doy la recomendación). También puedes tocar los botones rápidos. Cada consulta se registra en la Línea de Tiempo de la simulación.",
      };
    if (t.includes("irso"))
      return {
        role: "bot",
        text: "El IRSO es el Índice de Riesgo de Sobrecarga Organizacional (0 a 100). Es un indicador preventivo a nivel de servicio: no diagnostica burnout ni evalúa individualmente a los trabajadores.",
      };
    if (t.includes("para que sirve") || t.includes("para qué sirve"))
      return {
        role: "bot",
        text: `Samay Care sirve para anticipar la sobrecarga organizacional en el ${HOSPITAL.name}: detecta señales tempranas por servicio, orienta decisiones preventivas de jefaturas y Salud Ocupacional, y promueve actividades de bienestar para el personal.`,
      };
    if (t.includes("mapa") || t.includes("dashboard") || t.includes("tiempo"))
      return {
        role: "bot",
        text: "Mapa de Calor: riesgo por servicio sobre el plano del instituto. Dashboard: evolución del IRSO, demanda, ausencias e incidencias. Línea de Tiempo: cuándo comenzó el incremento del riesgo y el registro de tu simulación.",
      };
    if (t.includes("simulacion") || t.includes("simulación"))
      return {
        role: "bot",
        text: "La simulación se inicia con el botón 'Iniciar simulación' del menú superior. Todos los contadores parten en 0 y se van sumando según las consultas que hagas aquí; puedes verlos en la Línea de Tiempo.",
      };
    return {
      role: "bot",
      text: "Samay Care es una plataforma preventiva: recolecta datos operativos del hospital, los analiza y calcula el IRSO por servicio para detectar riesgo de sobrecarga antes de que afecte al personal y a la atención. Navega con Mapa de Calor, Dashboard y Línea de Tiempo.",
    };
  }

  if (topic === "bienestar")
    return {
      role: "bot",
      text: `Estas son algunas actividades y recursos de bienestar disponibles. Puedes consultar las actividades programadas por el ${HOSPITAL.name}.`,
      cards: true,
    };
  if (topic === "pausas")
    return {
      role: "bot",
      text: "Las pausas activas son ejercicios breves de 5 a 10 minutos durante la jornada: respiración guiada, movilidad de cuello y hombros, y estiramientos de espalda. Se recomiendan especialmente en los horarios críticos de cada servicio.",
      cards: true,
    };
  if (topic === "institucional")
    return {
      role: "bot",
      text: "Las actividades institucionales se publican en el calendario interno del instituto: talleres, campañas de salud ocupacional y jornadas de bienestar. Puedes consultar el calendario con tu área de Salud Ocupacional.",
      cards: true,
    };
  if (topic === "apoyo")
    return {
      role: "bot",
      text: "Recursos de apoyo disponibles: orientación de Salud Ocupacional, canales de acompañamiento al personal, guías de manejo de carga laboral y espacios de descanso. Si necesitas atención prioritaria, comunícate con tu jefatura de servicio.",
    };

  return {
    role: "bot",
    text: "Puedo orientarte sobre actividades de bienestar, pausas activas, actividades institucionales, recursos de apoyo y el uso de la plataforma (cómo funciona, para qué sirve, cómo usar el chatbot). Elige una opción rápida o escríbeme tu consulta.",
  };
}

const MAX_LISTEN_MS = 15000;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hola 👋 Soy Samay Care. Puedes escribirme o hablarme con el micrófono (15 s). Pregúntame por bienestar, pausas activas o cómo funciona la plataforma.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string, via: "texto" | "voz" = "texto") => {
    if (!text.trim()) return;
    const bot = answer(text);
    setMessages((m) => [...m, { role: "user", text }, bot]);
    recordQuery(classify(text.toLowerCase()), text.trim(), via);
    setInput("");
  };

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    timerRef.current = null;
    tickRef.current = null;
  };

  const stopListening = () => {
    clearTimers();
    setListening(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
  };

  const startListening = () => {
    setVoiceError(null);
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
    if (!SR) {
      setVoiceError("Tu navegador no admite reconocimiento de voz. Escribe tu consulta.");
      return;
    }
    const recognition = new SR();
    recognition.lang = "es-PE";
    recognition.continuous = true;
    recognition.interimResults = true;
    transcriptRef.current = "";

    recognition.onresult = (event: any) => {
      let finalText = "";
      for (let i = 0; i < event.results.length; i += 1) {
        finalText += event.results[i][0].transcript;
      }
      transcriptRef.current = finalText;
      setInput(finalText);
    };
    recognition.onerror = () => {
      setVoiceError("No se pudo escuchar el audio. Revisa el permiso del micrófono.");
      clearTimers();
      setListening(false);
    };
    recognition.onend = () => {
      clearTimers();
      setListening(false);
      const text = transcriptRef.current.trim();
      if (text) send(text, "voz");
      else setInput("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setVoiceError("No se pudo iniciar el micrófono.");
      return;
    }
    setListening(true);
    setSecondsLeft(15);
    tickRef.current = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    timerRef.current = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    }, MAX_LISTEN_MS);
  };

  useEffect(() => () => clearTimers(), []);

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
            <button
              onClick={() => {
                stopListening();
                setOpen(false);
              }}
              aria-label="Cerrar chat"
            >
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
            {listening && (
              <div className="mb-2 flex items-center gap-2 rounded-xl bg-leaf-soft px-3 py-2 text-[11px] font-medium text-deep">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                Escuchando… {secondsLeft}s restantes
              </div>
            )}
            {voiceError && (
              <p className="mb-2 text-[11px] text-muted-foreground">{voiceError}</p>
            )}
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
              <button
                onClick={() => send("¿Cómo funciona la plataforma?")}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-deep transition-colors hover:bg-sky-soft"
              >
                🧭 ¿Cómo funciona la plataforma?
              </button>
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
                placeholder="Escribe o habla tu consulta..."
                className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "Detener grabación" : "Hablar con el asistente"}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors ${
                  listening ? "bg-leaf-soft" : "hover:bg-sky-soft"
                }`}
              >
                {listening ? (
                  <Square className="h-4 w-4 text-deep" />
                ) : (
                  <Mic className="h-4 w-4 text-deep" />
                )}
              </button>
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
