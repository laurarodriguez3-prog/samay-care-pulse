import insn from "@/assets/aliado-image-6.png.asset.json";
import pcm from "@/assets/aliado-image-7.png.asset.json";
import gobierno from "@/assets/aliado-image-8.png.asset.json";
import insnWide from "@/assets/aliado-image-9.png.asset.json";

const logos = [
  { url: insn.url, alt: "Instituto Nacional de Salud del Niño San Borja" },
  { url: pcm.url, alt: "Presidencia del Consejo de Ministros del Perú" },
  { url: gobierno.url, alt: "Gobierno del Perú" },
  { url: insnWide.url, alt: "INSN" },
];

export function AliadosCarousel() {
  const strip = [...logos, ...logos];
  return (
    <section className="mt-16">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">
        Aliados
      </p>
      <h2 className="mt-2 text-center font-display text-2xl font-semibold text-deep">
        Instituciones que respaldan Samay Care
      </h2>
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-background py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-[aliados-marquee_28s_linear_infinite] items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {strip.map((l, i) => (
            <img
              key={`${l.url}-${i}`}
              src={l.url}
              alt={l.alt}
              loading="lazy"
              className="h-14 w-auto max-w-[220px] object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-16"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
