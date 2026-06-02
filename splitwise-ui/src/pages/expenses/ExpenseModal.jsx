import { useState, useEffect } from "react";
import { Modal, Field, PrimaryBtn, ModalFooter, inputSt } from "../../utils/util";
import { addExpense, updateExpense } from "../../api/expenses";


export default function ExpenseModal({ expense, members, groupId, onClose, onSaved }) {
    const isEdit = !!expense;
    const [desc, setDesc] = useState(expense?.description ?? "");
    const [amount, setAmount] = useState(expense?.amount ?? "");
    const [date, setDate] = useState(expense?.addedAt ?? new Date().toISOString().slice(0, 10));
    const paidByUserId = members.find(m => m.userName === expense?.paidBy)?.userId ?? members[0]?.userId ?? "";
    const [paidBy, setPaidBy] = useState(paidByUserId);
    const [splitStrategy, setSplitStrategy] = useState(expense?.expenseStrategy ?? "EQUAL");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [exactAmounts, setExactAmounts] = useState({});
    const [shares, setShares] = useState({});

    useEffect(() => {
        if (isEdit && expense) {
            if (expense.expenseStrategy === "EXACT") {
                setExactAmounts(
                    expense.splitDetails.reduce((acc, split) => {
                        acc[split.userId] = split.amount;
                        return acc;
                    }, {})
                );
            }

            if (expense.expenseStrategy === "SHARES") {
                setShares(
                    expense.splitDetails.reduce((acc, split) => {
                        acc[split.userId] = split.shares;
                        return acc;
                    }, {})
                );
            }

            if (expense.expenseStrategy === "EQUAL") {
                setSelectedUsers(
                    expense.splitDetails.reduce((acc, split) => {
                        acc[split.userId] = true;
                        return acc;
                    }, {})
                );
            }
        }
    }, [expense, isEdit]);

    const save = async () => {
        if (!desc || !amount) { setError("Fill in all fields."); return; }
        setLoading(true);
        try {
            const body = {
                groupId, expenseName: desc, amount: parseFloat(amount),
                expenseDate: date, paidBy, splitStrategy,
                splitDetails: splitStrategy === "EQUAL" ? members.filter(m => selectedUsers[m.userId]).map(m => ({ userId: m.userId }))
                    : splitStrategy === "EXACT" ? Object.entries(exactAmounts).filter(([_, v]) => v).map(([k, v]) => ({ userId: k, amount: parseFloat(v) }))
                        : Object.entries(shares).filter(([_, v]) => v).map(([k, v]) => ({ userId: k, shares: parseFloat(v) }))
            };
            isEdit
                ? await updateExpense({ ...body, id: expense.expenseId })
                : await addExpense(body);
            onSaved(); onClose();
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    return (
        <Modal title={isEdit ? "Edit expense" : "Add expense"} onClose={onClose}>
            <Field label="Description">
                <input value={desc} onChange={e => setDesc(e.target.value)}
                    placeholder="e.g. Dinner at beach shack" style={inputSt} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Amount (₹)">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        placeholder="0.00" style={inputSt} />
                </Field>
                <Field label="Date">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputSt} />
                </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Paid by">
                    <select value={paidBy} onChange={e => setPaidBy(e.target.value)} style={inputSt}>
                        {members.map(m => <option key={m.userId} value={m.userId}>{m.userName}</option>)}
                    </select>
                </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Split Strategy">
                    <select
                        value={splitStrategy}
                        onChange={(e) => setSplitStrategy(e.target.value)}
                        style={inputSt}
                    >
                        <option value="EQUAL">Equal</option>
                        <option value="EXACT">Exact Amounts</option>
                        <option value="SHARES">Shares</option>
                    </select>
                </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Split Between">
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            padding: 12,
                            maxHeight: 250,
                            overflowY: "auto"
                        }}
                    >
                        {members.map((member) => (
                            <div
                                key={member.userId}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 10
                                }}
                            >
                                <span>{member.userName}</span>

                                {splitStrategy === "EQUAL" && (
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers[member.userId] || false}
                                        onChange={(e) =>
                                            setSelectedUsers((prev) => ({
                                                ...prev,
                                                [member.userId]: e.target.checked
                                            }))
                                        }
                                    />
                                )}

                                {splitStrategy === "EXACT" && (
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={exactAmounts[member.userId] || ""}
                                        onChange={(e) =>
                                            setExactAmounts((prev) => ({
                                                ...prev,
                                                [member.userId]: e.target.value
                                            }))
                                        }
                                        style={{
                                            width: 120,
                                            ...inputSt
                                        }}
                                    />
                                )}

                                {splitStrategy === "SHARES" && (
                                    <input
                                        type="number"
                                        placeholder="Shares"
                                        value={shares[member.userId] || ""}
                                        onChange={(e) =>
                                            setShares((prev) => ({
                                                ...prev,
                                                [member.userId]: e.target.value
                                            }))
                                        }
                                        style={{
                                            width: 120,
                                            ...inputSt
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </Field>
            </div>
            {error && <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 4 }}>{error}</p>}
            <ModalFooter onCancel={onClose}>
                <PrimaryBtn label={loading ? "Saving…" : isEdit ? "Update" : "Add expense"}
                    onClick={save} disabled={loading} />
            </ModalFooter>
        </Modal>
    );
}