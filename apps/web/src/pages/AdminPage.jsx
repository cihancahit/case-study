import { styles } from "../ui/styles";

export default function AdminPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Admin Panel</h2>
          <span style={styles.muted}>Manage platform settings and users</span>
        </div>
      </div>
    </div>
  );
}