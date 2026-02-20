"use client";

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ borderTop: "1px solid var(--signal-ghost)" }} role="contentinfo">
      <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "clamp(24px, 4vw, 48px)", paddingRight: "clamp(24px, 4vw, 48px)", paddingTop: "24px", paddingBottom: "24px" }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }} className="md:justify-start md:flex-1">
            <div className="type-label" style={{ color: "var(--phosphor-dim)" }}>XSHOT.EXE</div>
            <div className="type-label" style={{ color: "var(--signal-cyan-60)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>SYS NOMINAL</span>
              <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
              <span>v0.1</span>
              <span style={{ color: "var(--signal-ghost)" }}>{"\u00B7"}</span>
              <span>2025</span>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "32px", justifyContent: "center" }} className="md:justify-end" aria-label="Footer links">
            {["DOCS", "GITHUB", "CONTACT"].map((item) => (
              <a key={item} href="#" className="type-label focus:outline-none focus:ring-1 focus:ring-[var(--signal-cyan-100)] rounded px-1"
                style={{ color: "var(--phosphor-dim)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal-cyan-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--phosphor-dim)")}
              >{item}</a>
            ))}
          </nav>
        </div>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <span className="type-label" style={{ color: "var(--signal-ghost)", opacity: 0.6, fontSize: "0.625rem" }}>{"\u00A9"} 2025 {"\u2014"} all transmissions monitored</span>
        </div>
      </div>
    </footer>
  );
}
