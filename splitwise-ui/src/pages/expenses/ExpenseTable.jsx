import { fmt, fmtDate, Avatar, BalanceChip, SectionSkeleton, ErrorCard, PrimaryBtn, OutlineBtn } from "../../utils/util";
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
                </colgroup>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Paid by</th>
                        <th>Amount</th>
                        <th>Split</th>
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
    const { description, paidBy, amount, expenseStrategy, expenseDate } = expense;

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
            <td className="actions-cell">
                <div style={{ display: "inline-flex", gap: 2 }}>
                    <ActionBtn icon="ti-edit" label="Edit expense" onClick={onEdit} variant="edit" />
                    <ActionBtn icon="ti-trash" label="Delete expense" onClick={onDelete} variant="danger" />
                </div>
            </td>
        </tr>
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
