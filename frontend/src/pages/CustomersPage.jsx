import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = { full_name: "", email: "", phone_number: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCustomers = () => api.listCustomers().then(setCustomers).catch((e) => setError(e.message));

  useEffect(() => {
    loadCustomers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.full_name || !form.email || !form.phone_number) {
      setError("All fields are required.");
      return;
    }
    try {
      await api.createCustomer(form);
      setForm(emptyForm);
      setSuccess("Customer created.");
      loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Customers</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone number" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        <button type="submit">Add Customer</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="list">
        {customers.map((c) => (
          <div key={c.id} className="list-item">
            <span>{c.full_name} - {c.email} - {c.phone_number}</span>
            <button onClick={async () => { await api.deleteCustomer(c.id); loadCustomers(); }}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
