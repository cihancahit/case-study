import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 980, margin: "0 auto" }}>
      <AppRouter />
    </div>
  );
}
