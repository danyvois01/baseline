import { ImageResponse } from "next/og";

/**
 * opengraph-image — social/link preview card for all routes (1200×630).
 * Generated at build time: Deep Navy background, Baseline wordmark,
 * tennis-lime accent line, and tagline.
 */

export const alt = "Baseline — Live ATP Tennis Rankings";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0A0E14",
          padding: "0 96px",
        }}
      >
        <div
          style={{
            width: 120,
            height: 12,
            background: "#DFFF00",
            borderRadius: 9999,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Baseline
        </div>
        <div
          style={{
            fontSize: 44,
            color: "rgba(255, 255, 255, 0.65)",
            marginTop: 28,
          }}
        >
          Live ATP Tennis Rankings
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
