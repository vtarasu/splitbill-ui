import { fmt, fmtDate, Avatar, SectionSkeleton, ErrorCard, PrimaryBtn, OutlineBtn } from "../../utils/util";
import { useState } from "react";

const STYLES = `
  .expense-table-wrap {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--color-border-tertiary, #e8eaed);
    background: var(--color-background-primary, #fff);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
  }

  .expense-table-wrap table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    table-layout: fixed;
  }

  .expense-table-wrap thead tr {
    background: var(--color-background-secondary, #f7f8fa);
  }

  .expense-table-wrap thead th {
    padding: 11px 16px;
    text-align: left;
    font-size: 10.5px;
    font-weight: 600;
    color: var(--color-text-secondary, #0b0c0d);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    border-bottom: 1px solid var(--color-border-tertiary, #e8eaed);
    white-space: nowrap;
  }

  .expense-table-wrap thead th.actions-col {
    text-align: center;
  }

  .expense-row td {
    padding: 12px 16px;
    color: var(--color-text-primary, #1a1d23);
    border-bottom: 1px solid var(--color-border-tertiary, #f0f1f3);
    vertical-align: middle;
    transition: background 0.12s ease;
  }

  .expense-row:last-child td {
    border-bottom: none;
  }

  .expense-row:hover td {
    background: var(--color-background-secondary, #f7f8fa);
  }

  .expense-desc {
    font-weight: 600;
    color: var(--color-text-primary, #1a1d23);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .paid-by-cell {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .paid-by-name {
    font-weight: 500;
    color: var(--color-text-primary, #1a1d23);
  }

  .amount-cell {
    font-size: 13px;
    font-weight: 500;
    color: #1e6e36;
    background: #edf7f1;
    border-radius: 6px;
    padding: 3px 8px;
    display: inline-block;
    letter-spacing: -0.01em;
  }

  .strategy-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 500;
    color: #5a5f7a;
    background: var(--color-background-secondary, #f2f3f7);
    border-radius: 20px;
    padding: 3px 10px;
    border: 1px solid var(--color-border-tertiary, #e4e6ec);
  }

  .date-cell {
    font-size: 12px;
    color: var(--color-text-secondary, #1e27f3);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .actions-cell {
    text-align: center;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary, #0c0f14);
    font-size: 15px;
    padding: 5px 6px;
    border-radius: 7px;
    transition: background 0.13s, color 0.13s, transform 0.1s;
    line-height: 1;
  }

  .action-btn:hover {
    transform: scale(1.08);
  }

  .action-btn.edit:hover {
    background: #eef2ff;
    color: #4361d8;
  }

  .action-btn.danger:hover {
    background: #fff0f0;
    color: #c0392b;
  }

  .empty-state {
    padding: 48px 24px;
    text-align: center;
    color: var(--color-text-secondary, #9aa5b4);
  }

  .empty-icon {
    font-size: 34px;
    display: block;
    margin-bottom: 10px;
    opacity: 0.45;
  }

  .empty-state p {
    font-size: 13.5px;
    margin: 0;
    color: var(--color-text-secondary, #9aa5b4);
  }

  /* Participants */
  .participants-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    cursor: default;
  }

  .participants-avatars {
    display: flex;
    align-items: center;
  }

  .p-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--color-background-primary, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9.5px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    margin-left: -7px;
    flex-shrink: 0;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.07);
    transition: transform 0.15s;
  }

  .p-avatar:first-child {
    margin-left: 0;
  }

  .p-count {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--color-text-secondary, #370437);
    background: var(--color-background-secondary, #f0f1f5);
    border: 1px solid var(--color-border-tertiary, #e4e6ec);
    border-radius: 20px;
    padding: 2px 7px;
    white-space: nowrap;
    line-height: 1.5;
  }

  /* Tooltip */
  .participants-group .p-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #1a1d23;
    border-radius: 9px;
    padding: 8px 12px;
    min-width: 120px;
    max-width: 220px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    z-index: 20;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

  .participants-group:hover .p-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .p-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1a1d23;
  }

  .p-tooltip-row {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 3px 0;
  }

  .p-tooltip-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .p-tooltip-name {
    font-size: 11.5px;
    font-weight: 500;
    color: #e8eaed;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export function ExpensesTable({ expenses, loading, error, onEdit, onDelete }) {
    if (loading) return (
        <div style={{ padding: 28, color: "var(--color-text-secondary)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-loader-2" style={{ fontSize: 16, animation: "spin 1s linear infinite" }} />
            Loading expenses…
        </div>
    );

    if (error) return (
        <div style={{ padding: 20, color: "#c0392b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff5f5", borderRadius: 10, margin: 12, border: "1px solid #ffd5d5" }}>
            <i className="ti ti-alert-circle" style={{ marginRight: 6 }} />
            {error}
        </div>
    );

    if (!expenses.length) return (
        <div className="expense-table-wrap">
            <style>{STYLES}</style>
            <div className="empty-state">
                <i className="ti ti-receipt-off empty-icon" aria-hidden="true" />
                <p>No expenses yet. Add your first expense to get started.</p>
            </div>
        </div>
    );

    return (
        <div className="expense-table-wrap">
            <style>{STYLES}</style>
            <table>
                <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Paid by</th>
                        <th>Amount</th>
                        <th>Split</th>
                        <th>Participants</th>
                        <th className="actions-col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp) => (
                        <ExpenseRow
                            key={exp.expenseId}
                            expense={exp}
                            onEdit={() => onEdit(exp)}
                            onDelete={() => onDelete(exp)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ExpenseRow({ expense, onEdit, onDelete }) {
    const { description, paidBy, amount, expenseStrategy, expenseDate, splitDetails = [] } = expense;

    return (
        <tr className="expense-row">
            <td>
                <span className="date-cell">{fmtDate(expenseDate)}</span>
            </td>
            <td>
                <span className="expense-desc" title={description}>{description}</span>
            </td>
            <td>
                <div className="paid-by-cell">
                    <Avatar name={paidBy} size={24} />
                    <span className="paid-by-name">{paidBy?.split(" ")[0]}</span>
                </div>
            </td>
            <td>
                <span className="amount-cell">{fmt(amount)}</span>
            </td>
            <td>
                <span className="strategy-badge">
                    <i className="ti ti-adjustments-horizontal" style={{ fontSize: 11 }} aria-hidden="true" />
                    {expenseStrategy}
                </span>
            </td>
            <td>
                <ParticipantsCell splitDetails={splitDetails} />
            </td>
            <td className="actions-cell">
                <div style={{ display: "inline-flex", gap: 2 }}>
                    <ActionBtn icon="ti-edit" label="Edit expense" onClick={onEdit} variant="edit" />
                    <ActionBtn icon="ti-trash" label="Delete expense" onClick={onDelete} variant="danger" />
                </div>
            </td>
        </tr>
    );
}

// ── Participants ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    "#5C6BC0", "#26A69A", "#EC407A", "#FFA726", "#AB47BC",
    "#42A5F5", "#66BB6A", "#EF5350", "#8D6E63", "#78909C",
];

function getAvatarColor(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

const MAX_AVATARS = 3;

function ParticipantsCell({ splitDetails = []}) {

    const names = splitDetails
        .map(detail => detail.userName || null)
        .filter(Boolean);

    if (!names.length) return <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>—</span>;

    const visible = names.slice(0, MAX_AVATARS);
    const remaining = names.length - MAX_AVATARS;

    return (
        <div className="participants-group">

            {/* Count badge */}
            <span className="p-count">
                {names.length} member{names.length !== 1 ? "s" : ""}
            </span>

            {/* Hover tooltip listing all names */}
            <div className="p-tooltip">
                {names.map((name, i) => (
                    <div key={i} className="p-tooltip-row">
                        <div className="p-tooltip-dot" style={{ background: getAvatarColor(name) }} />
                        <span className="p-tooltip-name">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ActionBtn({ icon, label, onClick, variant = "default" }) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={`action-btn ${variant}`}
            title={label}
        >
            <i className={`ti ${icon}`} aria-hidden="true" />
        </button>
    );
}
