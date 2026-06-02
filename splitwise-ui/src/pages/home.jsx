import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DashboardContent from "./dashboard";
import BalancesPage from "./BalancesPage";
import GroupsPage from "./groups/GroupsPage";
import { useSelector } from "react-redux";
import SettlementsPage from "./settlement/SettlementsPage";
import SettingsPage from "./SettingsPage";
import GroupDetailPage from "./groups/GroupDetailPage";

const pages = [
  { id: "Balances", label: "Balances", icon: "💰", content: <BalancesPage /> },
  { id: "Groups", label: "Groups", icon: "🏠", content: <GroupsPage /> },
  { id: "Payments",     label: "Payments",     icon: "💳", content: <SettlementsPage /> },
  { id: "Settings",  label: "Settings",  icon: "⚙️", content: <SettingsPage /> },
];

export default function HomePage() {
  const {userId, userName} = useSelector((state) => state.user);
  const [isOpen, setIsOpen]     = useState(true);
  const [active, setActive]     = useState("Balances");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

const renderContent = () => {
    if (active === "Groups" && selectedGroupId) {
      return (
        <GroupDetailPage
          groupId={selectedGroupId}
          onBack={() => setSelectedGroupId(null)}
        />
      );
    }
    switch (active) {
      case "Groups":      return <GroupsPage onViewGroup={setSelectedGroupId} />;
      case "Balances":    return <BalancesPage />;
      case "Payments":     return <SettlementsPage />;
      case "Settings":    return <SettingsPage />;
      default:            return <BalancesPage />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: isOpen ? 220 : 48,
          minWidth: isOpen ? 220 : 48,
          transition: "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden",
          background: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center",
                      justifyContent: "space-between", padding: 12,
                      borderBottom: "1px solid #e0e0e0", height: 48 }}>
          {isOpen && (
            <span style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>
              Welcome, {userName}!
            </span>
          )}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
            style={{ marginLeft: "auto", cursor: "pointer",
                     background: "none", border: "1px solid #ccc",
                     borderRadius: 6, width: 28, height: 28 }}
          >
            {isOpen ? "←" : "→"}
          </button>
        </div>

        {/* Nav items */}
        <nav>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActive(page.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                background: active === page.id ? "#fff" : "transparent",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{page.icon}</span>

              {/* Hidden when collapsed */}
              {isOpen && (
                <span style={{ fontSize: 14 }}>{page.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout action at bottom */}
        <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid #e0e0e0' }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔓</span>
            {isOpen && <span style={{ fontSize: 14 }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {renderContent()}
      </main>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 340, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0 }}>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ padding: '8px 12px' }}>Cancel</button>
              <button
                onClick={() => {
                  localStorage.removeItem('jwtToken');
                  setShowLogoutModal(false);
                  navigate('/login');
                }}
                style={{ padding: '8px 12px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: 4 }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}