import { Avatar, BalanceChip, SectionSkeleton, ErrorCard, cardStyle } from "../../utils/util";
import { fmt } from "../../utils/util";

export function NonGroupInfoSection({ balances, loading, error, onRefresh }) {
  if (loading) return <SectionSkeleton />;
  if (error)   return <ErrorCard message={error} onRetry={onRefresh} />;

  const totalOwe  = balances.filter(b => b.direction === "GIVE").reduce((s, b) => s + b.amount, 0);
  const totalOwed = balances.filter(b => b.direction === "GET").reduce((s, b) => s + b.amount, 0);
  const outstanding = balances.filter(b => b.direction !== "SETTLED").length;

  return (
    <div style={cardStyle}>
      {/* Summary metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                    gap: 10, marginBottom: 14 }}>
        {[
          { label: "You owe",        value: fmt(totalOwe),  color: "#A32D2D" },
          { label: "You are owed",   value: fmt(totalOwed), color: "#27500A" },
          { label: "Outstanding",    value: outstanding,
            color: outstanding > 0 ? "#A32D2D" : "#27500A" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--color-background-secondary)",
                                    borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>
              {label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color }}>{value}</div>
          </div>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)",
                   margin: "0 0 14px" }} />

      {/* Balance rows */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)",
                    textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
        Balances
      </div>

      {balances.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "8px 0" }}>
          No balances yet.
        </p>
      ) : balances.map(b => (
        <div key={b.userId} style={{ display: "flex", alignItems: "center",
                                     justifyContent: "space-between", padding: "8px 0",
                                     borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar name={b.userName} size={28} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{b.userName}</span>
          </div>
          <BalanceChip direction={b.direction} amount={b.amount} />
        </div>
      ))}
    </div>
  );
}