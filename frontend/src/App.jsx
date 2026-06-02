import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Inventory & Order Management</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/orders">Orders</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}
