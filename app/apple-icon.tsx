import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        }}
      >
        <svg width="90" height="90" viewBox="0 0 32 32" fill="none">
          <circle cx="6" cy="24" r="3.4" fill="#fff" />
          <circle cx="16" cy="8" r="3.4" fill="#fff" />
          <circle cx="26" cy="24" r="3.4" fill="#fff" />
          <path
            d="M8.5 22.5C11 18 13 15 16 11.5C19 15 21 18 23.5 22.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
            fill="none"
          />
        </svg>
      </div>
    ),
    size,
  );
}
