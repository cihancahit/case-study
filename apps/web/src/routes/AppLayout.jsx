import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function AppLayout() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 980, margin: "0 auto" }}>
      <Nav />
      <Outlet />
    </div>
  );
}
