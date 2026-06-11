import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getNonGroupBalances } from "../../api/balances";
import { getNonGroupExpenses } from "../../api/expenses";
import { NonGroupInfoSection } from "./NonGroupInfoSection";
import GroupExpensesSection from "../groups/GroupExpenses";
import DeleteModal from "../expenses/DeleteModal";
import ExpenseModal from "../expenses/ExpenseModal";
import AddNonGroupExpense from "./AddNonGroupExpense";


const PAGE_SIZE = 10;

export default function NonGroupExpensesPage() {
  const { currentUserId } = useSelector(s => s.user);

  // Section 1
  const [balances, setBalances] = useState([]);
  const [balLoading, setBalLoading] = useState(true);
  const [balError, setBalError] = useState(null);

  // Section 2
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expLoading, setExpLoading] = useState(true);
  const [expError, setExpError] = useState(null);


  const [modal, setModal] = useState(null);

  const fetchBalances = useCallback(async () => {
    setBalLoading(true); setBalError(null);
    try {
      const data = await getNonGroupBalances(currentUserId);
      setBalances(data);
    } catch (err) { setBalError(err.message); }
    finally { setBalLoading(false); }
  }, [currentUserId]);

  const fetchExpenses = useCallback(async (p = 0) => {
    setExpLoading(true); setExpError(null);
    try {
      const data = await getNonGroupExpenses({ pageNo: p, pageSize: PAGE_SIZE });
      setExpenses(data.results);
      setTotal(data.totalElements);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (err) { setExpError(err.message); }
    finally { setExpLoading(false); }
  }, [currentUserId]);

  useEffect(() => { fetchBalances(); }, [fetchBalances]);
  useEffect(() => { fetchExpenses(0); }, [fetchExpenses]);

  return (
    <div style={{
      padding: 24, display: "flex", flexDirection: "column",
      gap: 16, maxWidth: 960
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 12
      }}>
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>
            Non-group expenses
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
            Personal splits outside any group
          </p>
        </div>
        <button
          onClick={() => setModal("addFlow")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "7px 14px", fontSize: 13, fontWeight: 500,
            background: "#534AB7", color: "#EEEDFE",
            border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0
          }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
          Add expense
        </button>
      </div>

      {/* Section 1 — balances */}
      <NonGroupInfoSection
        balances={balances}
        loading={balLoading}
        error={balError}
        onRefresh={fetchBalances}
      />

      {/* Section 2 — expenses */}
      <GroupExpensesSection
        expenses={expenses}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={expLoading}
        error={expError}
        onPageChange={fetchExpenses}
        onEdit={exp => setModal({ type: "editExpense", expense: exp })}
        onDelete={exp => setModal({ type: "deleteExpense", expense: exp })}
        onRefresh={() => fetchExpenses(page)}
      />

      {/* Two-step add flow */}
      {modal === "addFlow" && (
        <AddNonGroupExpense
          onClose={() => setModal(null)}
          onSaved={() => { fetchBalances(); fetchExpenses(0); }}
        />
      )}
      {modal?.type === "editExpense" && <ExpenseModal 
        expense={modal.expense} 
        members={modal.expense.splitDetails?.map(split => ({
          userId: split.userId,
          userName: split.userName
          })) ?? []
        } 
        onClose={() => setModal(null)} 
        onSaved={() => { fetchExpenses(0); fetchBalances(); }} />}
      {modal?.type === "deleteExpense" && <DeleteModal expense={modal.expense} onClose={() => setModal(null)} onSaved={() => { fetchExpenses(0); fetchBalances(); }} />}

    </div>
  );
}