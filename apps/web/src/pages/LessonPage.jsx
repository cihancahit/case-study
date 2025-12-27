import { useState,useEffect } from "react";
import { http } from "../api/http";
import { styles } from "../ui/styles";

export default function LessonPage() {
  const [note, setNote] = useState("Canlı ders talebi");
  const [request, setRequest] = useState(null);
  const [match, setMatch] = useState(null);
  const [err, setErr] = useState("");
  const [mine, setMine] = useState([]);

const loadMine = async () => {
  try {
    const res = await http.get("/lesson-requests/mine");
    setMine(res.data.data);
  } catch (e) {
    // sessiz geçebilirsin
  }
};

useEffect(() => {
  loadMine();
}, []);

  const createReq = async () => {
    setErr("");
    try {
      const res = await http.post("/lesson-requests", { note });
      setRequest(res.data.data.request);
      setMatch(res.data.data.match || null);
    } catch (e) {
      setErr(e.userMessage || "Create failed");
    }
  };

  const doMatch = async () => {
    if (!request?.id) return;
    setErr("");
    try {
      const res = await http.post(`/lesson-requests/${request.id}/match`);
      setMatch(res.data.data);
    } catch (e) {
      setErr(e.userMessage || "Match failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Live Lesson</h2>
          <span style={styles.muted}>Request</span>
        </div>

        {err && <div style={{ ...styles.alert, marginBottom: 12 }}>{err}</div>}

        <div style={styles.card}>
          <div style={{ marginBottom: 8, ...styles.muted, fontSize: 13 }}>Note</div>
          <input style={styles.input} value={note} onChange={(e) => setNote(e.target.value)} />

          <div style={styles.buttonRow}>
            <button style={styles.buttonPrimary} onClick={createReq}>Create Request</button>
            {/* // test */}
            {/* <button style={styles.button} onClick={doMatch} disabled={!request?.id}>Match</button> */}
          </div>
        </div>

        {(request || match) && (
          <div style={{ marginTop: 12, ...styles.card }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Result</div>
            <pre style={{ margin: 0, background: "#f7f7f7", padding: 10, borderRadius: 10 }}>
{JSON.stringify({ request, match }, null, 2)}
            </pre>
          </div>
        )}
              <h3 style={{ marginTop: 16 }}>My Live Lesson Requests</h3>

<div style={styles.cardGrid}>
  {mine.length === 0 && (
    <div style={styles.card}>
      <div style={{ fontWeight: 700 }}>No requests yet</div>
      <div style={styles.muted}>Create a live lesson request to see it here.</div>
    </div>
  )}

  {mine.map((r) => (
    <div key={r.id} style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>Request: {r.id}</div>
        <div style={styles.muted}>{r.status}</div>
      </div>
      <div style={{ marginTop: 6, ...styles.muted, fontSize: 13 }}>
        {r.note}
      </div>
      <div style={{ marginTop: 8, ...styles.muted, fontSize: 13 }}>
        createdAt: {r.createdAt}
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}
