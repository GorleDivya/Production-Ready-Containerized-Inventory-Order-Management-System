import { useEffect, useState } from "react";
import { api } from "../api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <section className="grid">
      <div className="card"><h3>Total Products</h3><p>{data.total_products}</p></div>
      <div className="card"><h3>Total Customers</h3><p>{data.total_customers}</p></div>
      <div className="card"><h3>Total Orders</h3><p>{data.total_orders}</p></div>
      <div className="card"><h3>Low Stock Products</h3><p>{data.low_stock_products}</p></div>
    </section>
  );
}
