import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { useAuthStore } from "../store/authStore";
import { styles } from "../ui/styles";

const USERS = [
  { id: "u1", label: "u1 - Demo User 1" },
  { id: "i1", label: "i1 - Instructor One" },
  { id: "a1", label: "a1 - Admin" },
];

export default function LoginPage() {
  const [userId, setUserId] = useState("u1");
  const [err, setErr] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const login = async () => {
    setErr("");
    try {
      const res = await http.post("/auth/login", { userId });
      setAuth(res.data.data);
      nav("/");
    } catch (e) {
      setErr(e.userMessage || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: 520 }}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Login</h2>
          <span style={styles.muted}>Girişimci Türk</span>
        </div>

        <div style={styles.card}>
          <div style={{ marginBottom: 8, fontSize: 13, ...styles.muted }}>Select account</div>
          <select style={styles.select} value={userId} onChange={(e) => setUserId(e.target.value)}>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>

          <div style={styles.buttonRow}>
            <button style={styles.buttonPrimary} onClick={login}>
              Login
            </button>
          </div>

          {err && <div style={{ ...styles.alert, marginTop: 12 }}>{err}</div>}
        </div>
      </div>
    </div>
  );
}
