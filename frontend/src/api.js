const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(errorData.detail || "Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getDashboard: () => request("/dashboard/summary"),

  listProducts: () => request("/products"),
  createProduct: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  listCustomers: () => request("/customers"),
  createCustomer: (payload) => request("/customers", { method: "POST", body: JSON.stringify(payload) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: "DELETE" }),

  listOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (payload) => request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};
