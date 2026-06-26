import { useState, useEffect, useCallback } from "react";
import { userSettlement } from "../../api/user"; 

const PAGE_SIZE = 10;

const AVATAR_PALETTE = [
  ["#E6F1FB","#0C447C"],["#EEEDFE","#3C3489"],["#E1F5EE","#085041"],
  ["#FAEEDA","#633806"],["#FBEAF0","#72243E"],["#EAF3DE","#27500A"],
];
function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function avatarStyle(name = "") {
  const [bg, color] = AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
  return { background: bg, color };
}
function fmtAmount(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name }) {
  return (
    <span style={{
      width: 28, height: 28, borderRadius: "50%", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 500, marginRight: 8, flexShrink: 0,
      verticalAlign: "middle", ...avatarStyle(name),
    }}>
      {initials(name)}
    </span>
  );
}

function Paginator({ page, totalPages, totalElements, onPageChange }) {
  const start = page * PAGE_SIZE + 1;
  const end   = Math.min((page + 1) * PAGE_SIZE, totalElements);

  const buildPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    const pages = [0];
    const lo = Math.max(1, page - 1);
    const hi = Math.min(totalPages - 2, page + 1);
    if (lo > 1) pages.push("…");
    for (let i = lo; i <= hi; i++) pages.push(i);
    if (hi < totalPages - 2) pages.push("…");
    pages.push(totalPages - 1);
    return pages;
  };

  const btnStyle = (active = false) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "5px 10px", fontSize: 12, cursor: active ? "default" : "pointer",
    border: "0.5px solid", borderRadius: 8,
    borderColor: active ? "#534AB7" : "#ddd",
    background: active ? "#534AB7" : "transparent",
    color: active ? "#EEEDFE" : "var(--color-text-primary)",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderTop: "0.5px solid #e0e0e0",
                  background: "var(--color-background-secondary)" }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        {start}–{end} of {totalElements}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        <button style={btnStyle()} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          ← Prev
        </button>
        {buildPages().map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} style={{ padding: "5px 4px", fontSize: 12, color: "var(--color-text-secondary)" }}>…</span>
            : <button key={p} style={btnStyle(p === page)} onClick={() => p !== page && onPageChange(p)}>{p + 1}</button>
        )}
        <button style={btnStyle()} disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default function SettlementsPage() {
  const [rows, setRows]               = useState([]);
  const [page, setPage]               = useState(0);
  const [totalElements, setTotal]     = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const fetchPage = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userSettlement(p, PAGE_SIZE);
      setRows(data.settlements);
      setTotal(data.totalSettlements);
      setTotalPages(data.totalPages);
      setTotalAmount(data.totalAmount ?? 0);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPage(0); }, [fetchPage]);

  const th = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 500,
               color: "var(--color-text-secondary)", textTransform: "uppercase",
               letterSpacing: "0.04em", background: "var(--color-background-secondary)",
               borderBottom: "0.5px solid #e0e0e0" };
  const td = { padding: "11px 14px", borderBottom: "0.5px solid #f0f0f0",
               verticalAlign: "middle" };

  return (
    <div style={{ padding: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontWeight: 500, fontSize: 20 }}>Settlements</h2>
        <button onClick={() => fetchPage(page)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5,
                         padding: "6px 14px", fontSize: 13, border: "0.5px solid #ddd",
                         borderRadius: 8, background: "none", cursor: "pointer" }}>
          ↻ Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                    gap: 10, marginBottom: 18 }}>
        {[
          { label: "Total settlements", value: totalElements },
          { label: "Total amount settled", value: fmtAmount(totalAmount) },
          { label: "Current page", value: `${page + 1} of ${totalPages}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--color-background-secondary)",
                                    borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden" }}>
        {error && (
          <div style={{ padding: 20, color: "#A32D2D", fontSize: 13 }}>Error: {error}</div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13,
                        tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr>
              {["From", "To", "Amount", "Settled at"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ ...td, textAlign: "center", color: "var(--color-text-secondary)" }}>
                  Loading…
                </td>
              </tr>
            ) : rows.map((r) => (
              <tr key={r.id}
                  style={{ cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                <td style={td}>
                  <Avatar name={r.from} />
                  {r.from}
                </td>
                <td style={td}>
                  <i className="ti ti-arrow-right"
                     style={{ fontSize: 13, color: "#534AB7", verticalAlign: "middle", marginRight: 8 }}
                     aria-hidden="true" />
                  <Avatar name={r.to} />
                  {r.to}
                </td>
                <td style={{ ...td, fontWeight: 500, color: "#27500A" }}>
                  {fmtAmount(r.amount)}
                </td>
                <td style={{ ...td, fontSize: 12, color: "var(--color-text-secondary)" }}>
                  <i className="ti ti-calendar"
                     style={{ fontSize: 13, verticalAlign: "-2px", marginRight: 4 }}
                     aria-hidden="true" />
                  {fmtDate(r.settledAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && !error && (
          <Paginator
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={fetchPage}
          />
        )}
      </div>
    </div>
  );
}