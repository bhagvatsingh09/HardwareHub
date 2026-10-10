
import { useEffect, useState } from "react";
import {
  Package,
  FolderOpen,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "../../api/productApi";
import { getCategories, type Category } from "../../api/categoryApi";

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        getProducts({ page: 1, pageSize: 100 }),
        getCategories(),
      ]);

      setProducts(productResponse.items);
      setCategories(categoryResponse);
    } catch (err) {
      console.error("Dashboard request failed:", err);
      setError("Unable to load data. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.stockQuantity <= 5
  );

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      tone: "blue",
      note: "Products in catalog",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FolderOpen,
      tone: "purple",
      note: "Product groupings",
    },
    {
      label: "Total Stock Units",
      value: products.reduce((sum, product) => sum + product.stockQuantity, 0),
      icon: Boxes,
      tone: "green",
      note: "Across loaded products",
    },
    {
      label: "Low Stock",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      tone: "orange",
      note: "Products with 5 or fewer units",
    },
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-welcome-row">
        <div>
          <p className="admin-eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="admin-subtitle">
            Welcome back. Here’s what’s happening at your store.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading your store data...</div>
      ) : (
        <>
          <div className="admin-stat-grid">
            {stats.map(({ label, value, icon: Icon, tone, note }) => (
              <article className="admin-stat-card" key={label}>
                <div className="admin-stat-top">
                  <div className={`admin-stat-icon ${tone}`}>
                    <Icon size={21} />
                  </div>
                  <span className="admin-stat-note">{note}</span>
                </div>
                <p>{label}</p>
                <h2>{value.toLocaleString("en-IN")}</h2>
              </article>
            ))}
          </div>

          <div className="admin-content-grid">
            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Recent Products</h2>
                  <p>Your latest catalog overview</p>
                </div>
                <Link to="/admin/products" className="admin-text-link">
                  Manage <ArrowUpRight size={16} />
                </Link>
              </div>

              {products.length === 0 ? (
                <p className="admin-empty">No products found.</p>
              ) : (
                <div className="admin-product-list">
                  {products.slice(0, 5).map((product) => (
                    <div className="admin-product-row" key={product.id}>
                      <div className="admin-product-icon">
                        <Package size={19} />
                      </div>
                      <div className="admin-product-info">
                        <strong>{product.name}</strong>
                        <span>{product.category?.name || "Uncategorized"}</span>
                      </div>
                      <div className="admin-product-stock">
                        <strong>
                          ₹{product.price.toLocaleString("en-IN")}
                        </strong>
                        <span>{product.stockQuantity} {product.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Low Stock Alerts</h2>
                  <p>Products needing attention</p>
                </div>
                <AlertTriangle size={20} color="#d97706" />
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="admin-empty">
                  <Boxes size={28} />
                  <p>No low-stock products right now.</p>
                </div>
              ) : (
                <div className="admin-alert-list">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div className="admin-alert-row" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.stockQuantity} {product.unit} remaining</span>
                      </div>
                      <span className="admin-low-badge">Low stock</span>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/admin/inventory" className="admin-panel-footer">
                View inventory <ArrowUpRight size={16} />
              </Link>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;