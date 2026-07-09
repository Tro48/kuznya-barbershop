import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG-картинка генерируется, а не рисуется руками в Figma: текст правится в одном
 * месте с остальным контентом и не расходится с ним.
 *
 * Кириллица требует своего шрифта — встроенный в satori набор её не покрывает.
 */
export default async function OpengraphImage() {
  const oswald = await readFile(
    join(process.cwd(), "src/app/_fonts/Oswald-SemiBold.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0F0E0D",
        color: "#F2EDE6",
        padding: "72px",
        // Чертёжная сетка вместо вензелей.
        backgroundImage:
          "linear-gradient(#1A1816 1px, transparent 1px), linear-gradient(90deg, #1A1816 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Oswald",
          fontSize: 26,
          letterSpacing: "0.24em",
          color: "#A39B90",
        }}
      >
        <span>БАРБЕРШОП «{site.name.toUpperCase()}»</span>
        <span>САНКТ-ПЕТЕРБУРГ</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Oswald",
            fontSize: 128,
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {site.slogan}
        </div>
        <div style={{ display: "flex", marginTop: 40, alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 4, backgroundColor: "#C8963E" }} />
          <div style={{ fontSize: 30, color: "#A39B90" }}>
            Стрижка · борода · опасная бритва
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Oswald", data: oswald, weight: 600, style: "normal" }],
    },
  );
}
