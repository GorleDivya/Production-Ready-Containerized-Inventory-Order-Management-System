import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = { name: "", sku: "", price: "", quantity_in_stock: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = () =>
    api.listProducts().then(setProducts).catch((e) => setError(e.message));

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.sku || Number(form.price) <= 0 || Number(form.quantity_in_stock) < 0) {
      setError("Please fill valid product details.");
      return;
    }
    const payload = { ...form, price: Number(form.price), quantity_in_stock: Number(form.quantity_in_stock) };
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccess("Product updated.");
      } else {
        await api.createProduct(payload);
        setSuccess("Product created.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Products</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Stock" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} />
        <button type="submit">{editingId ? "Update" : "Add"} Product</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="list">
        {products.map((p) => (
          <div key={p.id} className="list-item">
            <span>{p.name} ({p.sku}) - ${p.price} - Stock: {p.quantity_in_stock}</span>
            <div>
              <button onClick={() => { setForm(p); setEditingId(p.id); }}>Edit</button>
              <button onClick={async () => { await api.deleteProduct(p.id); loadProducts(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
