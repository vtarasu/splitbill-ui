import { useState } from "react";
import { fetchUserDetails } from "../../api/user"; 
import { Modal } from "../../utils/util";
import ExpenseModal from "../expenses/ExpenseModal";

export default function AddNonGroupExpense({ onClose, onSaved }) {
  const [step, setStep]             = useState(1);
  const [input, setInput]           = useState("");
  const [tags, setTags]             = useState([]);      
  const [resolvedUsers, setResolvedUsers] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const addTag = () => {
    const v = input.trim();
    if (!v || tags.includes(v)) return;
    setTags(p => [...p, v]);
    setInput("");
    setError(null);
  };

  const removeTag = (t) => setTags(p => p.filter(x => x !== t));

  const goStep2 = async () => {
    if (tags.length < 2) {
      setError("Add at least 2 participants.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const users = await fetchUserDetails(tags);
      setResolvedUsers(users);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "One or more usernames were not found.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <ExpenseModal
        expense={null}
        members={resolvedUsers}
        groupId={null}
        onClose={onClose}
        onSaved={onSaved}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <Modal title="Add non-group expense" onClose={onClose}>
      <StepIndicator current={1} />

      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14 }}>
        Who is involved in this expense?
      </p>

      {/* Username input + Add button */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)",
                    textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
        Add people
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTag()}
          placeholder="Enter username"
          style={{ flex: 1, minWidth: 0, padding: "7px 10px", fontSize: 13,
                   border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
                   background: "var(--color-background-secondary)",
                   color: "var(--color-text-primary)", outline: "none" }}
        />
        <button onClick={addTag}
          style={{ padding: "7px 14px", fontSize: 13, cursor: "pointer",
                   border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
                   background: "none", color: "var(--color-text-secondary)" }}>
          Add
        </button>
      </div>

      {/* Tags */}
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)",
                    textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
        Participants ({tags.length})
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 36, marginBottom: 4 }}>
        {tags.length === 0 ? (
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            No participants added yet
          </span>
        ) : tags.map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5,
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 999, padding: "3px 10px", fontSize: 12 }}>
            {t}
            <button onClick={() => removeTag(t)}
              style={{ background: "none", border: "none", cursor: "pointer",
                       color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1 }}>
              ×
            </button>
          </span>
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 6,
                    display: "flex", alignItems: "center", gap: 4 }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 13 }} aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end",
                    marginTop: 16, paddingTop: 14,
                    borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <button onClick={onClose}
          style={{ padding: "7px 14px", fontSize: 13, cursor: "pointer",
                   border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
                   background: "none", color: "var(--color-text-secondary)" }}>
          Cancel
        </button>
        <button onClick={goStep2} disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: 5,
                   padding: "7px 14px", fontSize: 13, fontWeight: 500,
                   background: "#534AB7", color: "#EEEDFE", border: "none",
                   borderRadius: 8, cursor: loading ? "not-allowed" : "pointer",
                   opacity: loading ? 0.7 : 1 }}>
          {loading
            ? <><i className="ti ti-loader-2" style={{ fontSize: 13 }} aria-hidden="true" /> Validating…</>
            : <>Next <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></>}
        </button>
      </div>
    </Modal>
  );
}

// StepIndicator unchanged from original
function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      {[{ n: 1, label: "Select participants" }, { n: 2, label: "Expense details" }].map(({ n, label }, i) => (
        <>
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 500,
              background: n < current ? "#EAF3DE" : n === current ? "#534AB7" : "var(--color-background-secondary)",
              color: n < current ? "#27500A" : n === current ? "#EEEDFE" : "var(--color-text-secondary)",
              border: n < current ? "0.5px solid #97C459" : n > current ? "0.5px solid var(--color-border-secondary)" : "none",
            }}>
              {n < current
                ? <i className="ti ti-check" style={{ fontSize: 12 }} aria-hidden="true" />
                : n}
            </div>
            <span style={{ fontSize: 13, fontWeight: n === current ? 500 : 400,
                           color: n === current ? "#534AB7" : "var(--color-text-secondary)" }}>
              {label}
            </span>
          </div>
          {i === 0 && (
            <div style={{ flex: 1, height: "0.5px",
                          background: current > 1 ? "#97C459" : "var(--color-border-tertiary)" }} />
          )}
        </>
      ))}
    </div>
  );
}