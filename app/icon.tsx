import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#fff",
              marginTop: -8,
            }}
          />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
        </div>
      </div>
    ),
    size,
  );
}
