import { useEffect, useState } from "react";
import { http } from "../api/http";
import { styles } from "../ui/styles";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/courses");
        setCourses(res.data.data);
      } catch (e) {
        setErr(e.userMessage || "Failed to load courses");
      }
    })();
  }, []);

  const buy = async (courseId) => {
    setErr("");
    setBusy(courseId);
    try {
      const idempotencyKey = `web-${courseId}-${Date.now()}`;
      const res = await http.post("/checkout/create", { courseId, idempotencyKey });
      const data = res.data.data;

      if (data.provider === "STRIPE" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      const ok = confirm("Simulated payment: SUCCESS? (Cancel = FAIL)");
      const checkoutId = data.checkout?.id || data.checkoutId; // backend’de hangisi varsa
      await http.post("/checkout/confirm-simulated", { checkoutId, result: ok ? "success" : "fail" });
      alert(ok ? "Payment success" : "Payment failed");
    } catch (e) {
      setErr(e.userMessage || "Buy failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Courses</h2>
          <span style={styles.muted}>Buy + entitlement demo</span>
        </div>

        {err && <div style={{ ...styles.alert, marginBottom: 12 }}>{err}</div>}

        <div style={styles.cardGrid}>
          {courses.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{c.title}</div>
              <div style={{ ...styles.muted, marginTop: 6 }}>{c.description}</div>

              <div style={{ marginTop: 10, fontSize: 13, ...styles.muted }}>
                Price: {c.price?.amount} {c.price?.currency} (minor unit)
              </div>

              <div style={styles.buttonRow}>
                <button
                  style={styles.buttonPrimary}
                  disabled={busy === c.id}
                  onClick={() => buy(c.id)}
                >
                  {busy === c.id ? "Processing..." : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
