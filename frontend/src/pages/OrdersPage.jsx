import { useEffect, useState } from "react";
import { api } from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [o, c, p] = await Promise.all([api.listOrders(), api.listCustomers(), api.listProducts()]);
      setOrders(o);
      setCustomers(c);
      setProducts(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = () => {
    setSuccess("");
    setError("");
    const qty = Number(quantity);
    if (!productId) {
      setError("Select a product first.");
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Quantity must be a positive integer.");
      return;
    }
    setItems([...items, { product_id: Number(productId), quantity: Number(quantity) }]);
    setProductId("");
    setQuantity(1);
  };

  const create = async () => {
    setSuccess("");
    setError("");
    setSubmitting(true);
    try {
      await api.createOrder({ customer_id: Number(customerId), items });
      setItems([]);
      setCustomerId("");
      load();
      setSuccess("Order created successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canCreate = Boolean(customerId) && items.length > 0 && !submitting;
  const createDisabledReason = !customerId
    ? "Select a customer to create an order."
    : items.length === 0
      ? "Add at least one item to the order."
      : "";

  return (
    <section>
      <h2>Orders</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {loading ? <p>Loading...</p> : null}
      <div className="form">
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
        </select>
        <select value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => {
            const v = e.target.value;
            const parsed = parseInt(v === "" ? "0" : v, 10);
            setQuantity(Number.isNaN(parsed) ? 0 : parsed);
          }}
        />
        <button type="button" onClick={addItem}>Add Item</button>
        <button type="button" onClick={create} disabled={!canCreate}>
          {submitting ? "Creating..." : "Create Order"}
        </button>
        {!canCreate && createDisabledReason ? <p className="error" style={{ gridColumn: "1 / -1", margin: 0 }}>{createDisabledReason}</p> : null}
      </div>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>Product #{item.product_id} - Qty: {item.quantity}</li>
        ))}
      </ul>
      <div className="list">
        {orders.map((order) => (
          <div key={order.id} className="list-item">
            <span>Order #{order.id} - Customer #{order.customer_id} - Total ${order.total_amount}</span>
            <div>
              <button onClick={async () => setSelectedOrder(await api.getOrder(order.id))}>Details</button>
              <button onClick={async () => { await api.deleteOrder(order.id); load(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="card">
          <h3>Order #{selectedOrder.id}</h3>
          <p>Total: ${selectedOrder.total_amount}</p>
          <ul>
            {selectedOrder.items.map((item) => (
              <li key={item.id}>Product #{item.product_id} - Qty: {item.quantity} - Line ${item.line_total}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
