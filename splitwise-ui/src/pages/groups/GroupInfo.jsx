import { fmt, Avatar, cardStyle, BalanceChip, SectionSkeleton, ErrorCard, PrimaryBtn, OutlineBtn } from "../../utils/util";

export default function GroupInfoSection({ group, loading, error, onAddExpense, onAddMember, onRemoveMember }) {
  if (loading) return <p style={{ padding: 24, color: "gray" }}>Loading Group Info...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Error: {error}</p>;

  return (
    <div style={cardStyle}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>{group.groupName}</h2>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
            {group.memberCount} members
          </p>
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", flexShrink: 0 }}>
          <PrimaryBtn   icon="ti-plus"       label="Add expense"    onClick={onAddExpense} />
          <OutlineBtn   icon="ti-user-plus"  label="Add member"     onClick={onAddMember} />
          <OutlineBtn icon="ti-user-minus" label="Remove member" onClick={onRemoveMember} />
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)",
                   margin: "0 0 14px" }} />

      {/* Balances */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)",
                    textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
        Group balances
      </div>

      {group.balances.map((b, i) => (
        <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, padding: "3px", color: "var(--color-text-primary)" }}>
                  {b.from} &nbsp;
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "5px 8px", borderRadius: 999,
                    background: "#EAF3DE",
                    color: "#27500A"
                  }}>
                    Owes {fmt(b.amount)}
                  </span>
                  &nbsp;&nbsp;
                  {b.to}
                </span>
              </div>
            </div>
      ))}
    </div>
  );
}