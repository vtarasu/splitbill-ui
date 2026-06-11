import { useState } from "react";
import { Modal, ModalFooter } from "../../utils/util";
import { deleteExpense } from "../../api/expenses";

export default function DeleteModal({ expense, groupId, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await deleteExpense({ expenseId: expense.expenseId });
      onSaved(); onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal title="Delete expense" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <i className="ti ti-trash" style={{ fontSize: 32, color: "#A32D2D" }} aria-hidden="true" />
        <p style={{ fontWeight: 500, marginTop: 12 }}>Delete "{expense.description}"?</p>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 6 }}>
          This will remove the expense and update all balances. This cannot be undone.
        </p>
      </div>
      <ModalFooter onCancel={onClose}>
        <button onClick={confirm} disabled={loading}
          style={{ padding: "7px 16px", fontSize: 13, fontWeight: 500,
                   background: "#A32D2D", color: "#FCEBEB", border: "none",
                   borderRadius: 8, cursor: "pointer" }}>
          <i className="ti ti-trash" style={{ fontSize: 13, marginRight: 5 }} aria-hidden="true" />
          {loading ? "Deleting…" : "Delete"}
        </button>
      </ModalFooter>
    </Modal>
  );
}