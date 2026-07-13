import { ImageResponse } from "next/og";

export const alt = "Aygency — AI agent systems that run your business operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0A0A0F",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 64, height: 4, background: "#00E5FF", marginBottom: 44 }} />
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#F8F8FC",
          }}
        >
          AYGENCY
        </div>
        <div style={{ fontSize: 44, marginTop: 20, color: "#9B9BAE", maxWidth: 940 }}>
          Built once. Compound forever.
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 48,
            color: "#00E5FF",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          aygency.ai
        </div>
      </div>
    ),
    size
  );
}
