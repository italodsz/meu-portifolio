import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/GeistMono-Regular.ttf")),
]);

type OgOptions = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
};

/** Crateras da lua estilizada (posição e raio em % do diâmetro). */
const CRATERS = [
  { x: 30, y: 34, r: 11 },
  { x: 58, y: 22, r: 7 },
  { x: 48, y: 58, r: 14 },
  { x: 72, y: 50, r: 6 },
  { x: 24, y: 66, r: 6 },
  { x: 66, y: 76, r: 8 },
];

/** Imagem Open Graph: fundo preto, lua vermelha estilizada, nome e cargo. */
export async function renderOg({ eyebrow, title, subtitle, footer }: OgOptions) {
  const [bold, mono] = await fontsPromise;
  const moon = 520;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#08070b",
        color: "#f4f2f8",
        fontFamily: "Geist",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -160,
          top: -120,
          width: moon + 240,
          height: moon + 240,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,241,214,0.28) 0%, rgba(102,0,204,0.12) 40%, rgba(102,0,204,0) 65%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: 0,
          width: moon,
          height: moon,
          borderRadius: 9999,
          background:
            "radial-gradient(circle at 70% 30%, #fffaf0 0%, #ece2cd 30%, #9d978c 62%, #2a2826 100%)",
          display: "flex",
        }}
      >
        {CRATERS.map((crater, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${crater.x - crater.r}%`,
              top: `${crater.y - crater.r}%`,
              width: `${crater.r * 2}%`,
              height: `${crater.r * 2}%`,
              borderRadius: 9999,
              background:
                "radial-gradient(circle at 60% 40%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 55%, rgba(255,250,235,0.22) 72%, rgba(0,0,0,0) 80%)",
              display: "flex",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          ÍS<span style={{ color: "#8533ff" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 820 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "GeistMono",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8533ff",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#b8b3c4", lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "GeistMono",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8d8899",
          }}
        >
          {footer}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: bold, style: "normal", weight: 700 },
        { name: "GeistMono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
