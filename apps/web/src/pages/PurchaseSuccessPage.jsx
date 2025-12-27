import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { http } from "../api/http";

export default function PurchaseSuccessPage() {
  const [sp] = useSearchParams();
  const [msg, setMsg] = useState("Verifying payment...");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const checkoutId = sp.get("checkoutId");
        const sessionId = sp.get("session_id");
        if (!checkoutId || !sessionId) {
          setErr("Missing checkoutId or session_id");
          return;
        }
        await http.get(`/checkout/stripe-success?checkoutId=${encodeURIComponent(checkoutId)}&session_id=${encodeURIComponent(sessionId)}`);
        setMsg("Payment verified. Entitlement granted.");
      } catch (e) {
        setErr(e.userMessage || "Verification failed");
      }
    })();
  }, [sp]);

  return (
    <div>
      <h2>Purchase Success</h2>
      {err ? <p>{err}</p> : <p>{msg}</p>}
      <Link to="/purchases">Go to My Purchases</Link>
    </div>
  );
}
