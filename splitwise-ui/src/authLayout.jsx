import Login from './pages/login/login-user';
import Register from './pages/register/register-user';
import { Routes, Route } from 'react-router-dom';

function AuthLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left column ── */}
      <div className="left-col" style={{
        width: "45%", background: "#534AB7", color: "#EEEDFE",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 52px", position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320,
                      borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240,
                      borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Logo / brand */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-receipt-2" style={{ fontSize: 20 }} aria-hidden="true" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 500 }}>SplitBill</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.25,
                       marginBottom: 16, color: "#EEEDFE" }}>
            Split expenses.<br />Stay friends.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(238,237,254,0.75)",
                      maxWidth: 340, marginBottom: 48 }}>
            Track shared bills, settle balances, and keep everyone on the same page —
            whether it's a trip, a flat, or just dinner.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "ti-users",        text: "Create groups for trips, flatmates, or friends" },
              { icon: "ti-chart-pie",    text: "Automatic split calculations — equal or custom" },
              { icon: "ti-bell",         text: "Get notified when balances are settled" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                              background: "rgba(255,255,255,0.12)",
                              display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: 13, color: "rgba(238,237,254,0.82)", lineHeight: 1.5 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="right-col" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "var(--color-background-primary)",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Routes>
            <Route path="/"         element={<Login />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>

    </div>
  );
}

export default AuthLayout;