import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import  {getGroupInfo} from "../../api/groups";
import { getGroupExpenses } from "../../api/expenses";
import { settleGroupBalance } from "../../api/balances";
import GroupInfoSection from "./GroupInfo";
import GroupExpensesSection  from "./GroupExpenses";
import AddMemberModal from "./AddMember";
import RemoveMemberModal from "./RemoveMember";
import ExpenseModal from "../expenses/ExpenseModal";
import DeleteModal from "../expenses/DeleteModal";

const PAGE_SIZE = 10;

export default function GroupDetailPage({ groupId , onBack }) {
  const navigate    = useNavigate();

  // ── Section 1 state ──────────────────────────────────────
  const [group, setGroup]           = useState(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState(null);

  // ── Section 2 state ──────────────────────────────────────
  const [expenses, setExpenses]         = useState([]);
  const [page, setPage]                 = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [expLoading, setExpLoading]     = useState(true);
  const [expError, setExpError]         = useState(null);

  // Modal state
  const [modal, setModal] = useState(null);

  // ── Fetch section 1 ──────────────────────────────────────
  const fetchGroupInfo = useCallback(async () => {
    setGroupLoading(true);
    setGroupError(null);
    try {
      const data = await getGroupInfo(groupId);
      setGroup(data);
    } catch (err) {
      setGroupError(err.message);
    } finally {
      setGroupLoading(false);
    }
  }, [groupId]);

  // ── Fetch section 2 ──────────────────────────────────────
  const fetchExpenses = useCallback(async (p = 0) => {
    setExpLoading(true);
    setExpError(null);
    try {
      const data = await getGroupExpenses({ groupId, pageNo: p, pageSize: PAGE_SIZE });
      setExpenses(data.results);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (err) {
      setExpError(err.message);
    } finally {
      setExpLoading(false);
    }
  }, [groupId]);

  const onSettle = async (group, balance) => {
    setExpLoading(true);
    setExpError(null);
    console.log("Settling balance:", balance, "for group:", group.groupId);
    try {
      const data = await settleGroupBalance({ groupId: group.groupId, from: balance.from, to: balance.to, amount: balance.amount});
      console.log("Settlement successful:", data);
      fetchExpenses(0); 
      fetchGroupInfo();
    } catch (err) {
      setExpError(err.message);
    } finally {
      setExpLoading(false);
    }
  };

  // Fetch both on mount — independently, not chained
  useEffect(() => { fetchGroupInfo(); }, [fetchGroupInfo]);
  useEffect(() => { fetchExpenses(0); }, [fetchExpenses]);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column",
                  gap: 16, maxWidth: 960 }}>

      {/* Back */}
      <button onClick={() => onBack()}
        style={{ display: "inline-flex", alignItems: "center", gap: 5,
                 fontSize: 13, color: "var(--color-text-secondary)",
                 background: "none", border: "none", cursor: "pointer",
                 padding: 0, width: "fit-content" }}>
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />
        All groups
      </button>

      {/* Section 1 — group info + balances */}
      <GroupInfoSection
        group={group}
        loading={groupLoading}
        error={groupError}
        onAddExpense={() => setModal("addExpense")}
        onAddMember={() => setModal("addMember")}
        onRemoveMember={() => setModal("removeMember")}
        onSettle={onSettle}
        onRefresh={fetchGroupInfo}
      />

      {/* Section 2 — expenses with pagination */}
      <GroupExpensesSection
        expenses={expenses}
        members={group?.members ?? []}
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

      {/* Modals — same as before */}
      {modal === "addMember"     && <AddMemberModal   groupId={groupId} onClose={() => setModal(null)} onSaved={fetchGroupInfo} />}
      {modal === "removeMember"  && <RemoveMemberModal groupId={groupId} members={group?.members ?? []} onClose={() => setModal(null)} onSaved={fetchGroupInfo} />}
      {modal === "addExpense"    && <ExpenseModal    groupId={groupId} members={group?.members ?? []} onClose={() => setModal(null)} onSaved={() => { fetchExpenses(0); fetchGroupInfo(); }} />}
    
      {modal?.type === "editExpense"   && <ExpenseModal    groupId={groupId} expense={modal.expense} members={group?.members ?? []} onClose={() => setModal(null)} onSaved={() => {fetchExpenses(page); fetchGroupInfo(); } } />}
      {modal?.type === "deleteExpense" && <DeleteModal     expense={modal.expense} onClose={() => setModal(null)} onSaved={() => {fetchExpenses(page); fetchGroupInfo();}} />}
    </div>
  );
}