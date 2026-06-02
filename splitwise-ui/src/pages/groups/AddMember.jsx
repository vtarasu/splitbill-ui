import { useState } from "react";
import { addGroupMember } from "../../api/groups";
import { Modal, Field, PrimaryBtn, OutlineBtn, ModalFooter } from "../../utils/util";

export default function AddMemberModal({ groupId, onClose, onSaved }) {
  const [input, setInput]   = useState("");
  const [tags, setTags]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const addTag = () => {
    const v = input.trim();
    if (!v || tags.includes(v)) return;
    setTags(p => [...p, v]); setInput("");
  };

  const save = async () => {
    if (!tags.length) return;
    setLoading(true);
    try {
      await addGroupMember({ groupId, userName: tags });
      onSaved(); onClose();
    } catch (err) {
      setError(err.response?.data || "Failed to add members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add members" onClose={onClose}>
      <Field label="Name or email">
        <div style={{ display: "flex", gap: 6 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTag()}
            placeholder="Enter username"
            style={{ flex: 1, minWidth: 0, padding: "8px 10px", fontSize: 13,
              border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
              background: "var(--color-background-secondary)", color: "var(--color-text-primary)", outline: "none" }} />
          <OutlineBtn label="Add" onClick={addTag} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {tags.map(t => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5,
              background: "var(--color-background-secondary)",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: 999, padding: "3px 10px", fontSize: 12 }}>
              {t}
              <button onClick={() => setTags(p => p.filter(x => x !== t))}
                style={{ background: "none", border: "none", cursor: "pointer",
                         color: "var(--color-text-secondary)", fontSize: 14 }}>×</button>
            </span>
          ))}
        </div>
      </Field>
      <ModalFooter onCancel={onClose}>
        <PrimaryBtn label={loading ? "Saving…" : "Save"} onClick={save} disabled={loading} />
      </ModalFooter>
      {error && (
                        <div style={{ color: 'red' }}>
                            <p>{error}</p>
                        </div>
                    )}
    </Modal>
  );
}