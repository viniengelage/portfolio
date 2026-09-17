import { ImageResponse } from "next/og";

export const alt = "Vinicios Engelage — Full stack, app & interface";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#08070c",
          color: "#edeaf5",
        }}
      >
        {/* bloom: a assinatura visual do site */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 760,
            height: 520,
            background: "radial-gradient(circle, rgba(126,34,206,0.55) 0%, rgba(8,7,12,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background: "#a855f7",
              color: "#08070c",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            VE
          </div>
          <div style={{ display: "flex", color: "#c084fc", fontSize: 20, letterSpacing: 3 }}>
            DISPONÍVEL PARA PROJETOS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05 }}>
            Vinicios Engelage
          </div>
          <div style={{ display: "flex", color: "#9c96ae", fontSize: 34, lineHeight: 1.3 }}>
            Código que sustenta, interface que{" "}
            <span style={{ color: "#c084fc", fontStyle: "italic", marginLeft: 12 }}>respira.</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#837c98", fontSize: 22 }}>
          <div style={{ display: "flex" }}>Full stack · app &amp; interface</div>
          <div style={{ display: "flex" }}>viniengelage.com</div>
        </div>
      </div>
    ),
    size,
  );
}
