import { useState } from "react";
import { removeGroupMember } from "../../api/groups";
import { Modal, ModalFooter, OutlineBtn, initials } from "../../utils/util"

export default function RemoveMemberModal({ groupId, members, onClose, onSaved }) {
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const toggle = (userId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
    setError(null);
  };

  const handleRemove = async () => {
    if (!selected.size) {
      setError("Select at least one member to remove."); return;
    }
    setLoading(true);
    setError(null);
    try {
      await removeGroupMember({ groupId, userId: [...selected] });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Remove members" onClose={onClose}>

      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14 }}>
        Select members to remove from this group.
      </p>

      {/* Member list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280,
                    overflowY: "auto", marginBottom: 4 }}>
        {members.map(m => {
          const isSelected = selected.has(m.userId);
          return (
            <div
              key={m.userId}
              onClick={() => toggle(m.userId)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                border: `0.5px solid ${isSelected ? "#F09595" : "var(--color-border-tertiary)"}`,
                background: isSelected ? "#FCEBEB" : "var(--color-background-secondary)",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 500
                }}>
                  {initials(m.userName)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500,
                                color: isSelected ? "#791F1F" : "var(--color-text-primary)" }}>
                    {m.userName}
                  </div>
                  {m.email && (
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {m.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Checkbox */}
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                border: `0.5px solid ${isSelected ? "#A32D2D" : "var(--color-border-secondary)"}`,
                background: isSelected ? "#A32D2D" : "var(--color-background-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isSelected && (
                  <i className="ti ti-check"
                     style={{ fontSize: 12, color: "#FCEBEB" }} aria-hidden="true" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection count */}
      {selected.size > 0 && (
        <p style={{ fontSize: 12, color: "#791F1F", marginTop: 8 }}>
          <i className="ti ti-user-minus"
             style={{ fontSize: 13, verticalAlign: "-2px", marginRight: 4 }} aria-hidden="true" />
          {selected.size} member{selected.size > 1 ? "s" : ""} selected for removal
        </p>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 8,
                    display: "flex", alignItems: "center", gap: 5 }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 14 }} aria-hidden="true" />
          {error}
        </p>
      )}

      <ModalFooter onCancel={onClose}>
        <button
          onClick={handleRemove}
          disabled={loading || !selected.size}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "7px 16px", fontSize: 13, fontWeight: 500,
            background: selected.size ? "#A32D2D" : "var(--color-background-secondary)",
            color: selected.size ? "#FCEBEB" : "var(--color-text-secondary)",
            border: "none", borderRadius: 8,
            cursor: loading || !selected.size ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "background 0.15s",
          }}
        >
          <i className="ti ti-user-minus" style={{ fontSize: 14 }} aria-hidden="true" />
          {loading ? "Removing…" : `Remove${selected.size > 1 ? ` (${selected.size})` : ""}`}
        </button>
      </ModalFooter>
    </Modal>
  );
}