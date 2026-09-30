import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone para a tela inicial do iOS. */
export default async function AppleIcon() {
  const bold = await readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        borderRadius: 0,
        color: "#f5f5f5",
        fontFamily: "Geist",
        fontSize: 84,
        fontWeight: 700,
        letterSpacing: -4,
        paddingTop: 10,
      }}
    >
      ÍS<span style={{ color: "#ff2d20" }}>.</span>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: bold, style: "normal", weight: 700 }] },
  );
}
