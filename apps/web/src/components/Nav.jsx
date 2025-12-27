import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { styles } from "../ui/styles";

export default function Nav() {
  const { me, logout } = useAuthStore();
  const nav = useNavigate();
  if (!me) return null;

  const linkStyle = { textDecoration: "none" };

  return (
    <div style={{ ...styles.card, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
      

      {me.role === "user" && (
        <>
          <Link style={linkStyle} to="/purchases">My Purchases</Link>
          <Link style={linkStyle} to="/lesson">Live Lesson</Link>
          <Link style={linkStyle} to="/">Courses</Link>
        </>
      )}

      {me.role === "instructor" && (
        <>
          <Link style={linkStyle} to="/instructor">Instructor Panel</Link>
        </>
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={styles.muted}>{me.name} ({me.role})</span>
        <button
          style={styles.button}
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
