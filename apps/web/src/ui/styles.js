export const styles = {
  page: {
    minHeight: "calc(100vh - 40px)",
    display: "flex",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 820,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  title: { margin: 0, fontSize: 22 },
  muted: { opacity: 0.7 },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 14,
    background: "#fff",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },

  button: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
  },
  buttonPrimary: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  },
  buttonRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "#fff",
  },
  alert: {
    border: "1px solid #fee2e2",
    background: "#fff1f2",
    padding: 10,
    borderRadius: 10,
  },
};
