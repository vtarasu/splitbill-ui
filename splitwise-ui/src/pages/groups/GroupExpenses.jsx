import { ExpensesTable } from "../expenses/ExpenseTable";
import { cardStyle } from "../../utils/util";

const PAGE_SIZE = 10;

export default function GroupExpensesSection({
  expenses, page, totalPages, totalElements,
  loading, error, onPageChange, onEdit, onDelete,
}) {
  const start = page * PAGE_SIZE + 1;
  const end   = Math.min((page + 1) * PAGE_SIZE, totalElements);

  const buildPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    const pages = [0];
    const lo = Math.max(1, page - 1), hi = Math.min(totalPages - 2, page + 1);
    if (lo > 1) pages.push("…");
    for (let i = lo; i <= hi; i++) pages.push(i);
    if (hi < totalPages - 2) pages.push("…");
    pages.push(totalPages - 1);
    return pages;
  };

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px 12px" }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 500 }}>Expenses</span>
          {!loading && (
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 8 }}>
              {totalElements} total
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      {error ? (
        <p style={{ padding: "16px 18px", color: "var(--color-text-danger)", fontSize: 13 }}>
          {error}
        </p>
      ) : (
        <ExpensesTable
          expenses={expenses}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderTop: "0.5px solid var(--color-border-tertiary)",
                      background: "var(--color-background-secondary)" }}>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {start}–{end} of {totalElements}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <PagerBtn label="← Prev" disabled={page === 0}
              onClick={() => onPageChange(page - 1)} />

            {buildPages().map((p, i) =>
              p === "…"
                ? <span key={`e${i}`} style={{ padding: "5px 4px", fontSize: 12,
                    color: "var(--color-text-secondary)" }}>…</span>
                : <PagerBtn key={p} label={p + 1} active={p === page}
                    onClick={() => p !== page && onPageChange(p)} />
            )}

            <PagerBtn label="Next →" disabled={page === totalPages - 1}
              onClick={() => onPageChange(page + 1)} />
          </div>
        </div>
      )}
    </div>
  );
}

function PagerBtn({ label, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "5px 10px", fontSize: 12, cursor: disabled ? "default" : "pointer",
      border: "0.5px solid", borderRadius: 8,
      borderColor: active ? "#534AB7" : "var(--color-border-secondary)",
      background: active ? "#534AB7" : "var(--color-background-primary)",
      color: active ? "#EEEDFE" : "var(--color-text-primary)",
      opacity: disabled ? 0.38 : 1,
    }}>
      {label}
    </button>
  );
}