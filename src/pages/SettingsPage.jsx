import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {updateUserProfile, getUserProfile, updatePassword} from "../api/user";
import { SetUser } from "../redux/userslice";
import { getPasswordStrength } from "../utils/util";

export default function SettingsPage() {

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
      <ProfileSection />
      {<PasswordSection />}
    </div>
  );
}

function ProfileSection() {
  const dispatch = useDispatch();
  const { currentUserId } = useSelector(s => s.user);

  const [email, setEmail]         = useState("");
  const [mobile, setMobile]       = useState("");
  const [origEmail, setOrigEmail] = useState(""); 
  const [origMobile, setOrigMobile] = useState(""); 
  const [fetching, setFetching]   = useState(true);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      setFetching(true);
      try {
        const data = await getUserProfile();

        setEmail(data.emailId ?? "");
        setMobile(data.mobileNumber ?? "");
        setOrigEmail(data.emailId ?? ""); 
        setOrigMobile(data.mobileNumber ?? "");
      } catch (err) {
        setToast({ type: "error", msg: "Failed to load profile: " + err.message });
      } finally {
        setFetching(false);
      }
    };

    fetchMe();
  }, []);

  const isDirty = email !== origEmail || mobile !== origMobile;

  const reset = () => {
    setEmail(origEmail);
    setMobile(origMobile);
    setToast(null);
  };

  const save = async () => {
    if (!email || !email.includes("@")) {
      setToast({ type: "error", msg: "Please enter a valid email address." }); return;
    }
    if (!mobile || mobile.replace(/\D/g, "").length < 10) {
      setToast({ type: "error", msg: "Please enter a valid mobile number." }); return;
    }
    setLoading(true);
    try {
      await updateUserProfile({email, mobile });
      setOrigEmail(email);
      setOrigMobile(mobile);
      setToast({ type: "success", msg: "Profile updated successfully." });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card icon="ti-user" iconBg="#EEEDFE" iconColor="#3C3489"
            title="Profile information" subtitle="Update your email address and mobile number.">
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "8px 0" }}>
          Loading profile…
        </p>
      </Card>
    );
  }

  return (
    <Card icon="ti-user" iconBg="#EEEDFE" iconColor="#3C3489"
          title="Profile information" subtitle="Update your email address and mobile number.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
        <Field label="Email address">
          <InputWrap icon="ti-mail">
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setToast(null); }}
              style={inputStyle}
            />
          </InputWrap>
        </Field>
        <Field label="Mobile number">
          <InputWrap icon="ti-phone">
            <input
              type="tel" value={mobile}
              onChange={e => { setMobile(e.target.value); setToast(null); }}
              style={inputStyle}
            />
          </InputWrap>
        </Field>
      </div>
      <CardFooter
        toast={toast} loading={loading} disabled={!isDirty}
        onCancel={reset} onSave={save} saveLabel="Save changes" saveIcon="ti-check"
      />
    </Card>
  );
}

function PasswordSection() {
  const { currentUserId : userid } = useSelector(s => s.user);
  const [cur, setCur]     = useState("");
  const [nw, setNw]       = useState("");
  const [cfm, setCfm]     = useState("");
  const [show, setShow]   = useState({ cur: false, nw: false, cfm: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const strength = getPasswordStrength(nw);

  const reset = () => { setCur(""); setNw(""); setCfm(""); setToast(null); };

  const save = async () => {
    if (!cur)           { setToast({ type: "error", msg: "Enter your current password." }); return; }
    if (nw.length < 8)  { setToast({ type: "error", msg: "New password must be at least 8 characters." }); return; }
    if (nw !== cfm)     { setToast({ type: "error", msg: "New passwords do not match." }); return; }
    setLoading(true);
    try {
      await updatePassword({ oldPassword: cur, newPassword: nw });
      setToast({ type: "success", msg: "Password updated successfully." });
      setTimeout(reset, 1500);
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key) => setShow(p => ({ ...p, [key]: !p[key] }));

  return (
    <Card
      icon="ti-lock" iconBg="#E6F1FB" iconColor="#0C447C"
      title="Change password"
    >
      <Field label="Current password">
        <PasswordInput value={cur} onChange={e => setCur(e.target.value)}
          show={show.cur} onToggle={() => toggle("cur")} placeholder="Enter current password" />
      </Field>

      <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-tertiary)", margin: "16px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="New password">
          <PasswordInput value={nw} onChange={e => setNw(e.target.value)}
            show={show.nw} onToggle={() => toggle("nw")} placeholder="Min. 8 characters" />
          {nw && (
            <>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                    background: i <= strength.score ? strength.color : "var(--color-border-tertiary)" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: strength.color, marginTop: 4 }}>{strength.label}</div>
            </>
          )}
        </Field>
        <Field label="Confirm new password">
          <PasswordInput value={cfm} onChange={e => setCfm(e.target.value)}
            show={show.cfm} onToggle={() => toggle("cfm")} placeholder="Re-enter new password" />
          {cfm && (
            <div style={{ fontSize: 11, marginTop: 4,
              color: nw === cfm ? "#27500A" : "#791F1F" }}>
              {nw === cfm ? "Passwords match" : "Passwords do not match"}
            </div>
          )}
        </Field>
      </div>

      <CardFooter toast={toast} loading={loading} onCancel={reset} onSave={save}
        saveLabel="Update password" saveIcon="ti-lock" />
    </Card>
  );
}

function Card({ icon, iconBg, iconColor, title, subtitle, children }) {
  return (
    <div style={{ background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className={`ti ${icon}`} style={{ fontSize: 17, color: iconColor }} aria-hidden="true" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)",
                  marginBottom: 20, paddingLeft: 44 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500,
                      color: "var(--color-text-secondary)", textTransform: "uppercase",
                      letterSpacing: "0.04em", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function InputWrap({ icon, children }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <i className={`ti ${icon}`} style={{ position: "absolute", right: 10,
        top: "50%", transform: "translateY(-50%)", fontSize: 16,
        color: "var(--color-text-secondary)", pointerEvents: "none" }} aria-hidden="true" />
    </div>
  );
}

function PasswordInput({ value, onChange, show, onToggle, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} value={value}
        onChange={onChange} placeholder={placeholder} style={inputStyle} />
      <i className={`ti ${show ? "ti-eye-off" : "ti-eye"}`}
        onClick={onToggle} aria-label={show ? "Hide password" : "Show password"}
        style={{ position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", fontSize: 16, cursor: "pointer",
          color: "var(--color-text-secondary)" }} />
    </div>
  );
}

function CardFooter({ toast, loading, onCancel, onSave, saveLabel, saveIcon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 16, borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 4 }}>
      {toast ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13,
          padding: "6px 12px", borderRadius: 8,
          background: toast.type === "success" ? "#EAF3DE" : "#FCEBEB",
          color: toast.type === "success" ? "#27500A" : "#791F1F" }}>
          <i className={`ti ${toast.type === "success" ? "ti-circle-check" : "ti-alert-circle"}`}
            style={{ fontSize: 15 }} aria-hidden="true" />
          {toast.msg}
        </span>
      ) : <span />}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ padding: "7px 14px", fontSize: 13, cursor: "pointer",
          border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
          background: "none", color: "var(--color-text-secondary)" }}>
          Cancel
        </button>
        <button onClick={onSave} disabled={loading} style={{ display: "inline-flex", alignItems: "center",
          gap: 5, padding: "7px 18px", fontSize: 13, fontWeight: 500, background: "#534AB7",
          color: "#EEEDFE", border: "none", borderRadius: 8, cursor: "pointer",
          opacity: loading ? 0.6 : 1 }}>
          <i className={`ti ${saveIcon}`} style={{ fontSize: 14 }} aria-hidden="true" />
          {loading ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 36px 8px 10px", fontSize: 13,
  border: "0.5px solid var(--color-border-secondary)", borderRadius: 8,
  background: "var(--color-background-secondary)", color: "var(--color-text-primary)", outline: "none",
};