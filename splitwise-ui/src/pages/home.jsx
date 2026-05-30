import { useState } from "react";
import DashboardContent from "./dashboard";
import BalancesPage from "./BalancesPage";
import { useSelector } from "react-redux";

const pages = [
  { id: "Balances", label: "Balances", icon: "💰", content: <BalancesPage /> },
  { id: "Groups", label: "Groups", icon: "🏠", content: <DashboardContent /> },
  { id: "Payments",     label: "Payments",     icon: "💳", content: <DashboardContent /> },
  { id: "settings",  label: "Settings",  icon: "⚙️", content: <DashboardContent /> },
];

export default function HomePage() {
  const {userId, userName} = useSelector((state) => state.user);
  const [isOpen, setIsOpen]     = useState(true);
  const [active, setActive]     = useState("Balances");

  const currentPage = pages.find((p) => p.id === active);

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
                borderLeft: active === page.id ? "2px solid #7c3aed" : "2px solid transparent",
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
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {currentPage.content}
      </main>
    </div>
  );
}