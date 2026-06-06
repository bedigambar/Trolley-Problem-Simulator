import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "The Trolley Problem - An Ethical Dilemma Simulator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0b09",
          position: "relative",
        }}
      >
        {/* Background gradient circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: 100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(201, 169, 110, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: 100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(138, 110, 62, 0.1)",
          }}
        />

        {/* Scale icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
          }}
        >
          ⚖️
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e8dcc8",
            letterSpacing: "-2px",
            textAlign: "center",
          }}
        >
          The Trolley Problem
        </div>

        {/* Divider */}
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "rgba(201, 169, 110, 0.5)",
            marginTop: 32,
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: "#c9a96e",
            textAlign: "center",
          }}
        >
          An Ethical Dilemma Simulator
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#8a6e3e",
            }}
          >
            Utilitarian vs Deontological
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
