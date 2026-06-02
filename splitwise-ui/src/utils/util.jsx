import { useState } from "react";

// ── Formatting helpers ────────────────────────────────────
export const fmt = (n) =>
  "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export const fmtDate = (s) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

// ── Avatar ────────────────────────────────────────────────
const PALETTE = [
  ["#E6F1FB","#0C447C"],["#EEEDFE","#3C3489"],["#E1F5EE","#085041"],
  ["#FAEEDA","#633806"],["#FBEAF0","#72243E"],["#EAF3DE","#27500A"],
];
export function Avatar({ name = "", size = 28 }) {
  const [bg, color] = PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: size * 0.36, fontWeight: 500, background: bg, color }}>
      {initials}
    </div>
  );
}

export function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── Balance chip ──────────────────────────────────────────
export function BalanceChip({ direction, amount }) {
  if (direction === "SETTLED")
    return <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 999,
                          background: "var(--color-background-secondary)",
                          color: "var(--color-text-secondary)" }}>Settled</span>;
  const isOwe = direction === "GIVE";
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 999,
                   background: isOwe ? "#FCEBEB" : "#EAF3DE",
                   color: isOwe ? "#791F1F" : "#27500A" }}>
      {isOwe ? `Owes ${fmt(amount)}` : `Gets ${fmt(amount)}`}
    </span>
  );
}

// ── Buttons ───────────────────────────────────────────────
export function PrimaryBtn({ icon, label, onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "7px 13px", fontSize: 12, fontWeight: 500,
      background: "#534AB7", color: "#EEEDFE", border: "none",
      borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
    }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize: 14 }} aria-hidden="true" />}
      {label}
    </button>
  );
}

export function OutlineBtn({ icon, label, onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "7px 13px", fontSize: 12, fontWeight: 500,
      border: "0.5px solid var(--color-border-secondary)",
      borderRadius: 8, background: "none",
      color: "var(--color-text-primary)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
    }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize: 14 }} aria-hidden="true" />}
      {label}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{ background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 12, padding: "16px 18px", ...style }}>
      {children}
    </div>
  );
}

// ── Section title ─────────────────────────────────────────
export function SectionTitle({ children, style = {} }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                  marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: 16, minHeight: "100vh", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 14, padding: "24px 28px", width: "100%", maxWidth: 460,
        boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
        maxHeight: "calc(100vh - 40px)", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center",
                      justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
          <button onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer",
                     color: "var(--color-text-secondary)", fontSize: 18, padding: 2 }}>
            <i className="ti ti-x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Modal footer ──────────────────────────────────────────
export function ModalFooter({ onCancel, children }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end",
                  marginTop: 18, paddingTop: 14,
                  borderTop: "0.5px solid var(--color-border-tertiary)" }}>
      <OutlineBtn label="Cancel" onClick={onCancel} />
      {children}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────
export function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500,
                      color: "var(--color-text-secondary)", textTransform: "uppercase",
                      letterSpacing: "0.04em", marginBottom: 5 }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

// ── Shared input style ────────────────────────────────────
export const inputSt = {
  width: "100%", padding: "7px 10px", fontSize: 13,
  border: "0.5px solid var(--color-border-secondary)",
  borderRadius: 8, background: "var(--color-background-secondary)",
  color: "var(--color-text-primary)", outline: "none",
};

export const cardStyle = {
  background: "var(--color-background-primary)",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: 12,
  padding: "16px 18px",
};

export function SectionSkeleton() {
  const bar = (w, h = 12) => (
    <div style={{
      width: 6,
      height: 6,
      borderRadius: 6,
      background: "var(--color-background-secondary)",
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );

  return (
    <div style={cardStyle}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Header row skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bar("180px", 18)}
          {bar("120px", 12)}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {bar("100px", 30)}
          {bar("100px", 30)}
          {bar("120px", 30)}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)",
                   margin: "0 0 14px" }} />

      {/* Balance rows skeleton */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center",
                               justifyContent: "space-between", padding: "10px 0",
                               borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%",
                          background: "var(--color-background-secondary)",
                          animation: "pulse 1.5s ease-in-out infinite" }} />
            {bar("100px")}
          </div>
          {bar("80px", 24)}
        </div>
      ))}
    </div>
  );
}

export function ErrorCard({ message, onRetry }) {
  return (
    <div style={{ ...cardStyle, display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: "#FCEBEB", display: "flex",
                      alignItems: "center", justifyContent: "center" }}>
          <i className="ti ti-alert-circle"
             style={{ fontSize: 18, color: "#A32D2D" }} aria-hidden="true" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#791F1F" }}>
            Failed to load
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
            {message ?? "Something went wrong. Please try again."}
          </div>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", fontSize: 12, fontWeight: 500,
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 8, background: "none",
          color: "var(--color-text-primary)", cursor: "pointer", flexShrink: 0,
        }}>
          <i className="ti ti-refresh" style={{ fontSize: 14 }} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}