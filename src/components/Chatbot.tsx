import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Square, X } from "lucide-react";
import { HOSPITAL, wellnessActivities } from "@/lib/samay-data";
import { recordQuery, type TopicKey } from "@/lib/simulation";

type Msg = { role: "bot" | "user"; text: string; cards?: boolean };

const norm = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type Symptom = { keys: string[]; topic: TopicKey; text: string };

const symptoms: Symptom[] = [
  {
    keys: ["cuello", "cervical", "nuca", "torticolis", "hombro", "trapecio"],
    topic: "pausas",
    text: "Sentir tensión en cuello y hombros es muy común en turnos largos. Pausa activa recomendada (5 min): 1) Inclina la cabeza hacia cada hombro y mantén 20 s por lado. 2) Gira lentamente la cabeza de un lado al otro, 10 repeticiones. 3) Eleva y suelta los hombros 10 veces. 4) Respira profundo 4-4-6 (inhala 4 s, sostén 4 s, exhala 6 s). Repite cada 2 horas y evita mirar pantallas por debajo de la línea de los ojos. Si el dolor persiste más de 3 días, comunícate con Salud Ocupacional.",
  },
  {
    keys: ["espalda", "lumbar", "cintura", "columna"],
    topic: "pausas",
    text: "Para la molestia en la espalda: 1) Ponte de pie y estira los brazos hacia el techo 15 s. 2) Inclínate suavemente hacia adelante soltando el cuello, 20 s. 3) Haz báscula pélvica (10 repeticiones) apoyando la espalda en la pared. 4) Camina 3 minutos. Revisa la altura de tu silla y evita cargar peso con la espalda flexionada.",
  },
  {
    keys: ["pierna", "pies", "varices", "de pie", "parado", "parada", "rodilla"],
    topic: "pausas",
    text: "Si pasas muchas horas de pie: 1) Eleva los talones 15 veces para activar la circulación. 2) Estira los gemelos contra la pared, 20 s por pierna. 3) Siéntate 5 minutos con las piernas elevadas al terminar el turno. 4) Alterna el peso entre ambos pies mientras estés parada/o.",
  },
  {
    keys: ["ojos", "vista", "pantalla", "cabeza", "cefalea", "migrana", "jaqueca"],
    topic: "pausas",
    text: "Para fatiga visual y dolor de cabeza aplica la regla 20-20-20: cada 20 minutos mira 20 segundos a un punto lejano. Suma: parpadeo consciente 10 veces, masaje suave en sienes 30 s, hidratación (un vaso de agua) y bajar el brillo de la pantalla. Si el dolor es intenso o recurrente, acude a Salud Ocupacional.",
  },
  {
    keys: ["cansad", "agotad", "fatiga", "sin energia", "no doy mas", "extenuad", "sueno", "dormir", "insomnio"],
    topic: "apoyo",
    text: "El cansancio sostenido es una señal temprana de sobrecarga. Hoy: 1) Toma una micro-pausa de 10 minutos fuera del área asistencial. 2) Hidrátate y come algo ligero. 3) Haz respiración 4-7-8 durante 2 minutos. 4) Antes de dormir, evita pantallas 30 minutos y mantén un horario fijo de descanso. Si el agotamiento se repite varios días, coordina con tu jefatura una revisión de la distribución de turnos y avisa a Salud Ocupacional.",
  },
  {
    keys: ["estres", "estresad", "ansiedad", "ansios", "nervios", "presion", "abrumad", "saturad", "sobrecarg", "colaps"],
    topic: "apoyo",
    text: "Cuando la carga se siente abrumadora: 1) Respiración cuadrada 4-4-4-4 durante 2 minutos. 2) Escribe las 3 tareas realmente prioritarias del turno y delega o posterga el resto. 3) Toma una pausa activa de 5 minutos cada 2 horas. 4) Habla con tu jefatura de servicio y con Salud Ocupacional: la sobrecarga es un tema organizacional, no una falla personal.",
  },
  {
    keys: ["triste", "desanimad", "solo", "sola", "llorar", "desmotivad", "irritab", "enojad", "frustrad"],
    topic: "apoyo",
    text: "Gracias por contarlo, lo que sientes es válido. Sugerencias: 1) Tómate 10 minutos en un espacio tranquilo y haz respiración lenta. 2) Conversa con una persona de confianza del equipo. 3) Solicita orientación en Salud Ocupacional o en los canales de acompañamiento al personal. 4) Participa en una actividad de bienestar del calendario institucional. Si sientes malestar intenso o persistente, busca atención prioritaria con tu jefatura.",
  },
  {
    keys: ["mano", "muneca", "tunel", "dedos", "tecleando", "digitar"],
    topic: "pausas",
    text: "Para manos y muñecas: 1) Abre y cierra los puños 15 veces. 2) Gira las muñecas en ambos sentidos, 10 veces. 3) Estira los dedos hacia atrás con la palma extendida, 20 s por mano. 4) Alterna las tareas de digitación cada 30 minutos.",
  },
  {
    keys: ["turno", "guardia", "noche", "doble turno", "horas extra"],
    topic: "apoyo",
    text: "Los turnos prolongados reducen tu tiempo de recuperación. Recomendación: 1) Programa pausas activas de 5 minutos cada 2 horas del turno. 2) Hidrátate y evita cafeína en las últimas 3 horas. 3) Al salir, prioriza 20 minutos de descanso sin pantallas. 4) Registra la acumulación de turnos con tu jefatura: es una de las variables del IRSO y ayuda a prevenir la sobrecarga del servicio.",
  },
];

function detectSymptom(t: string): Symptom | null {
  const hasComplaint =
    /(me duele|dolor|molestia|tension|tengo|siento|me siento|estoy|no puedo|ando|me cuesta)/.test(t);
  const match = symptoms.find((s) => s.keys.some((k) => t.includes(k)));
  if (!match) return null;
  if (!hasComplaint && !/(cansad|agotad|estres|ansios|triste|insomnio|fatiga)/.test(t)) return null;
  return match;
}

const quick = [
  { key: "bienestar", label: "🌿 Actividades de bienestar" },
  { key: "pausas", label: "🧘 Pausas activas" },
  { key: "institucional", label: "📅 Actividades institucionales" },
  { key: "apoyo", label: "💚 Recursos de apoyo" },
  { key: "ayuda", label: "❓ Ayuda" },
];

function classify(raw: string): TopicKey {
  const t = norm(raw);
  const symptom = detectSymptom(t);
  if (symptom) return symptom.topic;
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
  const t = norm(input);
  const topic = classify(input);

  const symptom = detectSymptom(t);
  if (symptom) return { role: "bot", text: symptom.text, cards: symptom.topic === "pausas" };

  if (topic === "plataforma") {
    if (
      t.includes("indicador") ||
      t.includes("indice") ||
      t.includes("variable") ||
      t.includes("metrica")
    )
      return {
        role: "bot",
        text: "Los indicadores de Samay Care son: IRSO (Índice de Riesgo de Sobrecarga Organizacional, 0-100: bajo 0-49, moderado 50-69, alto 70-100), Carga de trabajo, Duración de turnos, Demanda de atenciones, Ausentismo, Recuperación (descanso entre jornadas), Incidencias y Distribución de tareas. Además verás la Tendencia (variación % del IRSO) y el Horario crítico de cada servicio. Sirven para anticipar la sobrecarga por servicio y tomar decisiones preventivas; no evalúan a personas.",
      };
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
    text: "Cuéntame también cómo te sientes (por ejemplo: “me duele el cuello”, “estoy agotada”) y te daré una pausa activa o recurso de apoyo. Puedo orientarte sobre actividades de bienestar, pausas activas, actividades institucionales, recursos de apoyo y el uso de la plataforma (cómo funciona, para qué sirve, cómo usar el chatbot). Elige una opción rápida o escríbeme tu consulta.",
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
      text: "Hola 👋 Soy Samay Care. Puedes escribirme o hablarme con el micrófono (15 s). Cuéntame cómo te sientes (ej.: “me duele el cuello”) y te recomiendo una pausa activa, o pregúntame cómo funciona la plataforma.",
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
    recordQuery(classify(text), text.trim(), via);
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
