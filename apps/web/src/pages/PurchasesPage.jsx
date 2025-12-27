import { useEffect, useState } from "react";
import { http } from "../api/http";
import { styles } from "../ui/styles";

export default function PurchasesPage() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/me/purchases");
        setList(res.data.data);
      } catch (e) {
        setErr(e.userMessage || "Failed");
      }
    })();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>My Purchases</h2>
          <span style={styles.muted}>Entitlements</span>
        </div>

        {err && <div style={{ ...styles.alert, marginBottom: 12 }}>{err}</div>}

        <div style={styles.cardGrid}>
          {list.map((x) => (
            <div key={x.entitlement.id} style={styles.card}>
              <div style={{ fontWeight: 700 }}>{x.course?.title || x.entitlement.courseId}</div>
              <div style={{ ...styles.muted, marginTop: 6, fontSize: 13 }}>
                grantedAt: {x.entitlement.grantedAt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
