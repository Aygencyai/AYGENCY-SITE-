import type { ReactNode } from "react";
import { Mark, colours as c } from "./brand";

/** Link-preview cards. Chosen by Louis on 30 Sep 2026 from rendered options. */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: c.void, fontFamily: "DM Sans", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          right: -200,
          top: -220,
          width: 700,
          height: 700,
          borderRadius: 700,
          background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, rgba(0,229,255,0) 70%)",
        }}
      />
      {children}
    </div>
  );
}

/** Every aygency.ai link: words on the left, the large mark on the right. */
export function SiteCard() {
  return (
    <Frame>
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "0 96px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 500, fontSize: 22, color: c.cyan, letterSpacing: "0.24em" }}>
            AI AGENT SYSTEMS
          </div>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 96, color: c.white, marginTop: 20, letterSpacing: "0.02em" }}>
            AYGENCY
          </div>
          <div style={{ fontSize: 38, color: c.ghostMuted, marginTop: 20, maxWidth: 600 }}>Built once, compounding forever.</div>
        </div>
        <Mark height={300} />
      </div>
    </Frame>
  );
}

/** Audit links: personalised with the invited company when there is one. */
export function AuditCard({ company }: { company: string | null }) {
  const name = company && company.length > 34 ? `${company.slice(0, 33)}…` : company;
  return (
    <Frame>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 96px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mark height={48} />
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 40, color: c.white, letterSpacing: "0.04em" }}>AYGENCY</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 500, fontSize: 24, color: c.cyan, letterSpacing: "0.24em" }}>
            {name ? `PREPARED FOR ${name.toUpperCase()}` : "FOR YOUR BUSINESS"}
          </div>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 84, color: c.white, marginTop: 20, lineHeight: 1 }}>
            AI Growth Audit
          </div>
          <div style={{ fontSize: 34, color: c.ghostMuted, marginTop: 24 }}>Where your team&apos;s time goes. About 5 minutes.</div>
        </div>
      </div>
    </Frame>
  );
}
