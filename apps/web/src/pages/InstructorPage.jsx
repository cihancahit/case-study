import { useEffect, useState } from "react";
import { http } from "../api/http";
import { styles } from "../ui/styles";

export default function InstructorPage() {
  const [assignments, setAssignments] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const a = await http.get("/instructor/assignments");
      setAssignments(a.data.data);
    } catch (e) {
      setErr(e.userMessage || "Load failed");
    }
  };

  useEffect(() => { load(); }, []);

  const accept = async (id) => {
    setErr("");
    try {
      await http.post(`/instructor/assignments/${id}/accept`);
      await load();
    } catch (e) {
      setErr(e.userMessage || "Accept failed");
    }
  };

  const reject = async (id) => {
    setErr("");
    try {
      await http.post(`/instructor/assignments/${id}/reject`);
      await load();
    } catch (e) {
      setErr(e.userMessage || "Reject failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Assignments</h2>
          <span style={styles.muted}>Only my incoming requests</span>
        </div>

        {err && <div style={{ ...styles.alert, marginBottom: 12 }}>{err}</div>}

        <div style={styles.cardGrid}>
          {assignments.length === 0 && (
            <div style={styles.card}>
              <div style={{ fontWeight: 700 }}>No assignments</div>
              <div style={styles.muted}>When a user matches, you’ll see it here.</div>
            </div>
          )}

          {assignments.map((a) => (
            <div key={a.id} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Assignment: {a.id}</div>
                <div style={styles.muted}>{a.status}</div>
              </div>

              <div style={{ marginTop: 6, ...styles.muted, fontSize: 13 }}>
                requestId: {a.requestId}
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.buttonPrimary} disabled={a.status !== "ASSIGNED"} onClick={() => accept(a.id)}>
                  Accept
                </button>
                <button style={styles.button} disabled={a.status !== "ASSIGNED"} onClick={() => reject(a.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
