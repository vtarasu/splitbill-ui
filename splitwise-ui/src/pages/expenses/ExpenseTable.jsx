import { fmt, fmtDate, Avatar, cardStyle, BalanceChip, SectionSkeleton, ErrorCard, PrimaryBtn, OutlineBtn } from "../../utils/util";
import { useState } from "react";

export function ExpensesTable({ expenses, loading, error, onEdit, onDelete }) {
    if (loading) return <p style={{ padding: 24, color: "gray" }}>Loading Group Info...</p>;
    if (error) return <p style={{ padding: 24, color: "red" }}>Error: {error}</p>;


    if (!expenses.length) {
        return (
            <div style={{
                padding: "32px 18px", textAlign: "center",
                color: "var(--color-text-secondary)", fontSize: 13
            }}>
                <i className="ti ti-receipt-off" style={{
                    fontSize: 28, display: "block",
                    marginBottom: 8
                }} aria-hidden="true" />
                No expenses yet. Add your first expense.
            </div>
        );
    }

    const th = {
        padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 500,
        color: "var(--color-text-secondary)", textTransform: "uppercase",
        letterSpacing: "0.04em", background: "var(--color-background-secondary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
    };
    const td = {
        padding: "10px 12px", color: "var(--color-text-primary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)", verticalAlign: "middle",
    };

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
            <colgroup>
                <col style={{ width: "28%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
                <tr>
                    <th style={th}>Expense Description</th>
                    <th style={th}>Paid by</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Added By</th>
                    <th style={th}>Expense Date</th>
                    <th style={{ ...th, textAlign: "center" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((exp, i) => (
                    <ExpenseRow
                        key={exp.expenseId}
                        expense={exp}
                        isLast={i === expenses.length - 1}
                        onEdit={() => onEdit(exp)}
                        onDelete={() => onDelete(exp)}
                        td={td}
                    />
                ))}
            </tbody>
        </table>
    );
}

function ExpenseRow({ expense, isLast, onEdit, onDelete, td }) {
    const { description, paidBy, amount, addedBy, addedAt } = expense;
    const rowTd = isLast ? { ...td, borderBottom: "none" } : td;

    return (
        <tr
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
            onMouseLeave={e => e.currentTarget.style.background = ""}
        >
            <td style={{ ...rowTd, fontWeight: 500 }}>{description}</td>
            <td style={rowTd}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Avatar name={paidBy} size={22} />
                    <span>{paidBy?.split(" ")[0]}</span>
                </div>
            </td>
            <td style={{ ...rowTd, fontWeight: 500, color: "#27500A" }}>
                {fmt(amount)}
            </td>
            <td style={rowTd}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Avatar name={addedBy} size={22} />
                    <span>{addedBy?.split(" ")[0]}</span>
                </div>
            </td>
            <td style={{ ...rowTd, fontSize: 12, color: "var(--color-text-secondary)" }}>
                {fmtDate(addedAt)}
            </td>
            <td style={{ ...rowTd, textAlign: "center" }}>
                <div style={{ display: "inline-flex", gap: 2 }}>
                    <ActionBtn icon="ti-edit" label="Edit expense" onClick={onEdit} />
                    <ActionBtn icon="ti-trash" label="Delete expense" onClick={onDelete} danger />
                </div>
            </td>
        </tr>
    );
}

function ActionBtn({ icon, label, onClick, danger = false }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            aria-label={label}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? (danger ? "#FCEBEB" : "var(--color-background-secondary)") : "none",
                border: "none", cursor: "pointer",
                color: hovered && danger ? "#A32D2D" : "var(--color-text-secondary)",
                fontSize: 16, padding: 4, borderRadius: 6,
            }}
        >
            <i className={`ti ${icon}`} aria-hidden="true" />
        </button>
    );
}