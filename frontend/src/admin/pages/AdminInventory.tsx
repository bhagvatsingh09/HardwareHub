import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Package,
  RefreshCw,
  Search,
  TrendingDown,
} from "lucide-react";
import { getProducts, type Product } from "../../api/productApi";
import "../styles/adminInventory.css";

type StockFilter = "all" | "low" | "out";

function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        pageSize: 50,
      });

      setProducts(response.items);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError("Unable to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + product.stockQuantity,
      0
    );

    const lowStock = products.filter(
      (product) =>
        product.stockQuantity > 0 && product.stockQuantity <= 10
    ).length;

    const outOfStock = products.filter(
      (product) => product.stockQuantity <= 0
    ).length;

    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        (product.category?.name ?? "").toLowerCase().includes(searchText);

      let matchesStock = true;

      if (stockFilter === "low") {
        matchesStock =
          product.stockQuantity > 0 && product.stockQuantity <= 10;
      } else if (stockFilter === "out") {
        matchesStock = product.stockQuantity <= 0;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  function getStockStatus(quantity: number) {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className: "inventory-status out",
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low Stock",
        className: "inventory-status low",
      };
    }

    return {
      label: "In Stock",
      className: "inventory-status available",
    };
  }

  return (
    <main className="admin-inventory">
      <header className="inventory-header">
        <div>
          <span className="inventory-eyebrow">HARDWAREHUB ADMIN</span>
          <h1>Inventory Management</h1>
          <p>
            Monitor product quantities and identify items that need
            restocking.
          </p>
        </div>

        <button
          className="inventory-refresh"
          onClick={() => void loadInventory()}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="inventory-error">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => void loadInventory()}>
            Try Again
          </button>
        </div>
      )}

      <section className="inventory-stats">
        <article className="inventory-stat-card">
          <div className="inventory-stat-icon blue">
            <Package size={23} />
          </div>
          <div>
            <p>Total Products</p>
            <h2>{loading ? "—" : inventoryStats.totalProducts}</h2>
            <span>Products in the catalog</span>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon purple">
            <Boxes size={23} />
          </div>
          <div>
            <p>Total Stock</p>
            <h2>
              {loading
                ? "—"
                : inventoryStats.totalStock.toLocaleString("en-IN")}
            </h2>
            <span>Total units across products</span>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon orange">
            <TrendingDown size={23} />
          </div>
          <div>
            <p>Low Stock</p>
            <h2>{loading ? "—" : inventoryStats.lowStock}</h2>
            <span>10 units or fewer</span>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon red">
            <AlertTriangle size={23} />
          </div>
          <div>
            <p>Out of Stock</p>
            <h2>{loading ? "—" : inventoryStats.outOfStock}</h2>
            <span>Products with no stock</span>
          </div>
        </article>
      </section>

      <section className="inventory-panel">
        <div className="inventory-panel-header">
          <div>
            <h2>Stock Overview</h2>
            <p>Search products and check their current stock levels.</p>
          </div>
        </div>

        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search product or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="inventory-filter"
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(event.target.value as StockFilter)
            }
            aria-label="Filter inventory by stock status"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {loading ? (
          <div className="inventory-empty">
            <RefreshCw size={32} className="inventory-loading-icon" />
            <h3>Loading inventory...</h3>
            <p>Fetching the latest product stock levels.</p>
          </div>
        ) : error ? (
          <div className="inventory-empty">
            <AlertTriangle size={32} />
            <h3>Inventory unavailable</h3>
            <p>Refresh the inventory to try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            <Package size={35} />
            <h3>No products found</h3>
            <p>Try another search or stock filter.</p>
          </div>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Stock Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stockQuantity);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="inventory-product">
                          <div className="inventory-product-icon">
                            <Package size={20} />
                          </div>
                          <div>
                            <strong>{product.name}</strong>
                            <span>
                              {product.unit || "unit"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{product.category?.name || "Uncategorized"}</td>

                      <td className="inventory-price">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td>
                        <strong>{product.stockQuantity}</strong>{" "}
                        <span className="inventory-unit">
                          {product.unit || "unit"}
                        </span>
                      </td>

                      <td>
                        <span className={status.className}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <footer className="inventory-table-footer">
            Showing {filteredProducts.length} of {products.length} loaded
            products
          </footer>
        )}
      </section>
    </main>
  );
}

export default AdminInventory;