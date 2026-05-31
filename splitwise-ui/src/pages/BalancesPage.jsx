import { useState, useEffect, useCallback } from "react";
import { getBalances, settleBalance } from "../api/balances";
import { useSelector } from "react-redux";

export default function BalancesPage() {
  const { userId, userName } = useSelector((state) => state.user);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settling, setSettling] = useState(new Set());

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBalances();
      setBalances(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchBalances(); }, [fetchBalances]);

  const handleSettle = async (balance) => {
    const fromId = balance.direction === "GIVE" ? userId : balance.userId;
    const toId = balance.direction === "GIVE" ? balance.userId : userId;

    const requestBody = { fromUserId: fromId, toUserId: toId, amount: balance.amount };

    setLoading(true);
    setError(null);
    try {
      const data = await settleBalance(requestBody);
      setBalances(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Summary totals ---
  const totalOwed = balances.filter(b => b.direction === "GET")
    .reduce((s, b) => s + b.amount, 0);
  const totalOwe = balances.filter(b => b.direction === "GIVE")
    .reduce((s, b) => s + b.amount, 0);
  const net = totalOwed - totalOwe;

  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  if (loading) return <p style={{ padding: 24, color: "gray" }}>Loading balances…</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 500, fontSize: 20 }}>Balances</h2>
        <button onClick={fetchBalances} style={{ cursor: "pointer" }}>↻ Refresh</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "You owe", value: fmt(totalOwe), color: "#A32D2D" },
          { label: "You are owed", value: fmt(totalOwed), color: "#3B6D11" },
          { label: "Net balance", value: (net >= 0 ? "+" : "-") + fmt(net), color: net >= 0 ? "#3B6D11" : "#A32D2D" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#f5f5f5", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "gray", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e0e0e0", background: "#fafafa" }}>
              {["User", "Direction", "Amount", "Action"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontWeight: 500, fontSize: 11, color: "gray",
                  textTransform: "uppercase", letterSpacing: "0.04em"
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {balances.map((b) => (
              <BalanceRow
                key={b.userId}
                balance={b}
                isSettling={settling.has(b.userId)}
                onSettle={() => handleSettle(b)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Avatar({ name }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#E6F1FB:#0C447C", "#EEEDFE:#3C3489", "#E1F5EE:#085041", "#FAEEDA:#633806"];
  const pick = colors[name.charCodeAt(0) % colors.length].split(":");
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: pick[0], color: pick[1],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 500
    }}>
      {initials}
    </div>
  );
}

function BalanceRow({ balance, isSettling, onSettle }) {
  const { userName, direction, amount } = balance;
  const fmt = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0", opacity: 1 }}>
      <td style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={userName} />
          <div>
            <div style={{ fontWeight: 500 }}>{userName}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "12px 14px" }}>
        {direction === "GIVE" ? (
          <Chip color="#FCEBEB" text="#A32D2D" label="↑ You owe" />
        ) : (
          <Chip color="#EAF3DE" text="#3B6D11" label="↓ Owes you" />
        )}
      </td>
      <td style={{
        padding: "12px 14px", fontWeight: 500,
        color: direction === "GIVE" ? "#A32D2D" : "#3B6D11"
      }}>
        {fmt(amount)}
      </td>
      <td style={{ padding: "12px 14px" }}>

        <button
          onClick={onSettle}
          disabled={isSettling}
          style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 6,
            border: "1px solid #ccc", background: "none", cursor: "pointer"
          }}
        >
          {isSettling ? "Settling…" : "Settle up"}
        </button>

      </td>
    </tr>
  );
}

function Chip({ color, text, label }) {
  return (
    <span style={{
      background: color, color: text, fontSize: 11,
      padding: "3px 8px", borderRadius: 999, display: "inline-block"
    }}>
      {label}
    </span>
  );
}