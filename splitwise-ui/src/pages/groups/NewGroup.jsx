import { useState } from "react";
import { useSelector } from "react-redux";
import { createGroup } from "../../api/groups";

const inputStyle = {
  width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #ddd",
  borderRadius: 8, background: "#f9f9f9", outline: "none",
};
const ghostBtn = {
  padding: "7px 14px", fontSize: 13, border: "1px solid #ddd",
  borderRadius: 8, background: "none", cursor: "pointer",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, color: "gray", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function NewGroup({ onClose, onCreated }) {
  const { currentUserId } = useSelector((s) => s.user);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMember = () => {
    const val = memberInput.trim();
    if (!val || members.find((m) => m.userName === val)) return;
    setMembers((prev) => [...prev, { userName: val }]);
    setMemberInput("");
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const newGroup = await createGroup({
        groupName: groupName.trim(),
        groupMembers: members.map((m) => m.userName),
      });
      onCreated(newGroup);
      onClose();
    } catch (err) {
      setError(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 24,
        width: "100%", maxWidth: 420, border: "1px solid #e0e0e0",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>Create new group</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        <Field label="Group name">
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Goa Trip 2026"
            style={inputStyle}
          />
        </Field>

        <Field label="Add members">
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              placeholder="userName "
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addMember} style={ghostBtn}>Add</button>
          </div>
          {members.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {members.map((m) => (
                <span key={m.userName} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#f5f5f5", border: "1px solid #ddd",
                  borderRadius: 999, padding: "3px 10px", fontSize: 12,
                }}>
                  {m.userName}
                  <button
                    onClick={() => setMembers((p) => p.filter((x) => x.userName !== m.userName))}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                  >×</button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {error && <p style={{ color: "#A32D2D", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{
          display: "flex", gap: 8, justifyContent: "flex-end",
          paddingTop: 16, borderTop: "1px solid #f0f0f0"
        }}>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 500,
              background: "#534AB7", color: "#fff", border: "none",
              borderRadius: 8, cursor: "pointer"
            }}
          >
            {loading ? "Creating…" : "✓ Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}
