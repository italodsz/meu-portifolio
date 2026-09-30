import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon "ÍS." gerado no build. */
export default async function Icon() {
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
        borderRadius: 14,
        color: "#f5f5f5",
        fontFamily: "Geist",
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: -1.5,
        paddingTop: 4,
      }}
    >
      ÍS<span style={{ color: "#ff2d20" }}>.</span>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: bold, style: "normal", weight: 700 }] },
  );
}
