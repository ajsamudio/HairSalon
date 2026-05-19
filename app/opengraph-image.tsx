import { ImageResponse } from "next/og";
import { clientConfig } from "@/client.config";

export const runtime = "edge";
export const alt = clientConfig.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const { name, tagline, neighborhood, city } = clientConfig.business;
  const accent = clientConfig.brand.primaryColor;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#1F2937",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent bar top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: accent,
          }}
        />

        {/* Location pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: accent + "22",
              border: `1px solid ${accent}44`,
              color: accent,
              borderRadius: "100px",
              padding: "6px 16px",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {neighborhood} · {city}
          </div>
        </div>

        {/* Salon name */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: "20px",
          }}
        >
          {name}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#9CA3AF",
            fontWeight: 400,
          }}
        >
          {tagline}
        </div>

        {/* Bottom accent dot */}
        <div
          style={{
            position: "absolute",
            bottom: "64px",
            right: "64px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: accent,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
