import { useState, useEffect, useCallback } from "react";
import { getAllGroups, deleteGroup } from "../../api/groups";
import NewGroup from "./NewGroup";
import { useNavigate } from "react-router-dom";

const BALANCE_PREVIEW = 3;

function fmt(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function BalanceChip({ amount }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "5px 8px", borderRadius: 999,
      background: "#EAF3DE",
      color: "#27500A"
    }}>
      Owes {fmt(amount)}
    </span>
  );
}

export function GroupCard({ id, group, onViewDetails, onDelete }) {
  const { groupName, memberCount, balances = [] } = group;
  const preview = balances.slice(0, BALANCE_PREVIEW);
  const extra = balances.length - BALANCE_PREVIEW;
  const allSettled = balances.length == 0;

  return (
    <div style={{
      border: "0.5px solid",
      borderRadius: 12, padding: 18,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header — name + member count */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 12
      }}>
        <span style={{
          fontSize: 15, fontWeight: 500,
          color: "var(--color-text-primary)", lineHeight: 1.3
        }}>
          {groupName}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, color: "var(--color-text-secondary)",
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap"
        }}>
          <i className="ti ti-users" style={{ fontSize: 13 }} aria-hidden="true" />
          {memberCount}
        </span>
      </div>

      {/* Balances section */}
      <div style={{
        fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)",
        textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8
      }}>
        Balances
      </div>

      {allSettled ? (
        <div style={{
          fontSize: 13, color: "var(--color-text-secondary)",
          display: "flex", alignItems: "center", gap: 6, padding: "4px 0"
        }}>
          <i className="ti ti-circle-check" style={{ fontSize: 15, color: "#3B6D11" }} aria-hidden="true" />
          All settled up
        </div>
      ) : (
        <>
          {preview.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: i < preview.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, padding: "3px", color: "var(--color-text-primary)" }}>
                  {b.from} &nbsp;
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "5px 8px", borderRadius: 999,
                    background: "#EAF3DE",
                    color: "#27500A"
                  }}>
                    Owes {fmt(b.amount)}
                  </span>
                  &nbsp;&nbsp;
                  {b.to}
                </span>
              </div>
            </div>
          ))}

          {extra > 0 && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", paddingTop: 6 }}>
              +{extra} more balance{extra > 1 ? "s" : ""}…
            </div>
          )}
        </>
      )}

      {/* Footer — view details */}
      <div style={{
        marginTop: 14, paddingTop: 12,
        borderTop: "0.5px solid var(--color-border-tertiary)",
        display: "flex", justifyContent: "flex-end"
      }}>

        {allSettled && (<button onClick={onDelete} style={{
          fontSize: 13, color: "#534AB7", fontWeight: 500, background: "none",
          border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Delete group
          <i className="ti" style={{ fontSize: 13 }} aria-hidden="true" />
        </button>
        )}
        <button onClick={onViewDetails} style={{
          fontSize: 13, color: "#534AB7", fontWeight: 500, background: "none",
          border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          View details
          <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #ddd",
  borderRadius: 8, background: "#f9f9f9", outline: "none",
};
const ghostBtn = {
  padding: "7px 14px", fontSize: 13, border: "1px solid #ddd",
  borderRadius: 8, background: "none", cursor: "pointer",
};

// ── Main Page ──────────────────────────────────────────────
export default function GroupsPage({ onViewGroup }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const filtered = groups.filter((g) =>
    g.groupName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete group. Please try again.");
    }
  };

  if (loading) return <p style={{ padding: 24, color: "gray" }}>Loading groups…</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 500, fontSize: 20 }}>Groups</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", fontSize: 13, fontWeight: 500,
            background: "#534AB7", color: "#fff", border: "none",
            borderRadius: 8, cursor: "pointer"
          }}
        >
          + New group
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search groups…"
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: "gray", textAlign: "center", padding: 40 }}>No groups found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
          {filtered.map((g) => (
            <GroupCard
              key={g.groupId}
              group={g}
              onViewDetails={() => onViewGroup(g.groupId)}
              onDelete={() => handleDeleteGroup(g.groupId)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NewGroup
          onClose={() => setShowModal(false)}
          onCreated={(newGroup) => setGroups((prev) => [newGroup, ...prev])}
        />
      )}

      {deleteError && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
        }}>
          <div style={{
            width: "100%",
            maxWidth: 380,
            background: "#fff",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Delete failed</div>
            <p style={{ margin: 0, color: "#333", lineHeight: 1.6 }}>{deleteError}</p>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteError(null)}
                style={{
                  ...ghostBtn,
                  borderColor: "#b0b0b0",
                  color: "#333",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}