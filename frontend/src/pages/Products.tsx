import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Package,
  RefreshCw,
} from "lucide-react";
import { getProducts, type Product } from "../api/productApi";
import {
  getCategories,
  type Category,
} from "../api/categoryApi";
import "../styles/products.css";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productResponse, categoryResponse] = await Promise.all([
        getProducts({
          page: 1,
          pageSize: 50,
        }),
        getCategories(),
      ]);

      setProducts(productResponse.items);

      // Customer-facing filters should contain active categories only.
      const activeCategories = categoryResponse.filter(
        (item) => item.isActive
      );

      setCategories(activeCategories);

      // Respect a category selected on Home or the Categories page.
      const requestedCategoryId = searchParams.get("categoryId");
      const validCategory = activeCategories.some(
        (item) => item.id === requestedCategoryId
      );

      if (requestedCategoryId && validCategory) {
        setCategoryId(requestedCategoryId);
      } else {
        setCategoryId("all");
      }
    } catch (error) {
      console.error("Failed to load products or categories:", error);
      setError("Unable to load products and categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleCategoryChange(newCategoryId: string) {
    setCategoryId(newCategoryId);

    // Keep the URL in sync with the selected category.
    if (newCategoryId === "all") {
      searchParams.delete("categoryId");
    } else {
      searchParams.set("categoryId", newCategoryId);
    }

    setSearchParams(searchParams);
  }

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        (product.description ?? "").toLowerCase().includes(searchText);

      const productCategoryId =
        product.categoryId || product.category?.id;

      const matchesCategory =
        categoryId === "all" || productCategoryId === categoryId;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryId]);

  return (
    <main className="products-page">
      <section className="products-header">
        <div>
          <span className="products-label">HARDWAREHUB CATALOG</span>

          <h1>Our Products</h1>

          <p>
            Quality hardware and building materials for every project.
          </p>
        </div>
      </section>

      <section className="products-controls">
        <div className="product-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="category-filter">
          <SlidersHorizontal size={18} />

          <select
            value={categoryId}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="category-buttons">
        <button
          className={categoryId === "all" ? "active" : ""}
          onClick={() => handleCategoryChange("all")}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item.id}
            className={categoryId === item.id ? "active" : ""}
            onClick={() => handleCategoryChange(item.id)}
          >
            {item.name}
          </button>
        ))}
      </section>

      {loading ? (
        <div className="no-products">
          <RefreshCw size={42} className="loading-icon" />

          <h2>Loading products...</h2>

          <p>Please wait while we load our catalog.</p>
        </div>
      ) : error ? (
        <div className="no-products">
          <Package size={42} />

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button onClick={loadData}>Try Again</button>
        </div>
      ) : (
        <>
          <section className="products-info">
            <div>
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </div>
          </section>

          {filteredProducts.length > 0 ? (
            <section className="products-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    
<img
  src={product.imageUrl || "/placeholder-product.jpg"}
  alt={product.name}
  onError={(event) => {
    const image = event.currentTarget;

    if (!image.src.endsWith("/placeholder-product.jpg")) {
      image.src = "/placeholder-product.jpg";
    }
  }}
/>


                    <span
                      className={
                        product.stockQuantity <= 10
                          ? "stock-badge low-stock"
                          : "stock-badge"
                      }
                    >
                      {product.stockQuantity <= 10
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>

                  <div className="product-content">
                    <span className="product-category">
                      {product.category?.name || "Hardware"}
                    </span>

                    <h2>{product.name}</h2>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-price">
                      ₹{product.price.toLocaleString("en-IN")}
                      <span> / {product.unit}</span>
                    </div>

                    <div className="product-footer">
                      <span>
                        <Package size={16} />
                        {product.stockQuantity} available
                      </span>

                      <Link to={`/products/${product.id}`}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="no-products">
              <Package size={42} />

              <h2>No products found</h2>

              <p>
                {categoryId !== "all"
                  ? "This category has no matching products yet. Try another category or select All."
                  : "Try a different search or category."}
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Products;

