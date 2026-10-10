  import { useEffect, useState } from "react";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories, type Category } from "../api/categoryApi";
import "../styles/home.css";

function getCategoryIcon(name: string): string {
  const categoryName = name.toLowerCase();

  if (categoryName.includes("electrical")) return "💡";
  if (categoryName.includes("hand tool")) return "🔧";
  if (categoryName.includes("power tool")) return "⚡";
  if (categoryName.includes("plumb")) return "🚰";
  if (categoryName.includes("fastener")) return "🔩";
  if (categoryName.includes("paint")) return "🎨";
  if (categoryName.includes("wood")) return "🪵";
  if (categoryName.includes("cement")) return "🧱";

  return "🔩";
}

const featuredProducts = [
  {
    id: 1,
    name: "Professional Claw Hammer",
    category: "Hand Tools",
    price: 450,
    stock: 18,
    unit: "piece",
  },
  {
    id: 2,
    name: "Cordless Power Drill",
    category: "Power Tools",
    price: 2850,
    stock: 7,
    unit: "piece",
  },
  {
    id: 3,
    name: "PVC Pipe 1 Inch",
    category: "Plumbing",
    price: 120,
    stock: 45,
    unit: "piece",
  },
  {
    id: 4,
    name: "Steel Screw Set",
    category: "Fasteners",
    price: 280,
    stock: 3,
    unit: "box",
  },
];

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        // Only active categories are visible to customers.
        setCategories(data.filter((category) => category.isActive));
        setCategoriesError(false);
      } catch (error) {
        console.error("Failed to load home page categories:", error);
        setCategoriesError(true);
      }
    };

    loadCategories();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            YOUR TRUSTED HARDWARE STORE
          </span>

          <h1>
            Quality Hardware.
            <br />
            <span>Reliable Service.</span>
          </h1>

          <p>
            Find the tools, materials and hardware supplies you need
            for your next project.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-button">
              Browse Products
              <ArrowRight size={18} />
            </Link>

            <Link to="/contact" className="secondary-button">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="home-search">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search for tools, materials or products..."
          />
          <button>Search</button>
        </div>
      </section>

      {/* Categories from the backend */}
      <section className="section">
        <div className="section-header">
          <div>
            <span className="section-label">SHOP BY CATEGORY</span>
            <h2>Find What You Need</h2>
          </div>

          <Link to="/categories" className="view-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {categoriesError ? (
          <p>Unable to load categories right now.</p>
        ) : categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to={`/products?categoryId=${category.id}`}
                className="category-card"
                key={category.id}
              >
                <div className="category-icon">
                  {getCategoryIcon(category.name)}
                </div>

                <h3>{category.name}</h3>

                <p>
                  {category.description ||
                    "Quality products and accessories."}
                </p>

                <ArrowRight
                  size={18}
                  className="category-arrow"
                />
              </Link>
            ))}
          </div>
        ) : (
          <p>No active categories available at the moment.</p>
        )}
      </section>

      {/* Featured Products */}
      <section className="section products-section">
        <div className="section-header">
          <div>
            <span className="section-label">FEATURED PRODUCTS</span>
            <h2>Popular Products</h2>
          </div>

          <Link to="/products" className="view-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              className="product-card"
              key={product.id}
            >
              <div className="product-image">
                <Wrench size={42} />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <div className="product-bottom">
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  <span
                    className={
                      product.stock <= 5
                        ? "stock low-stock"
                        : "stock"
                    }
                  >
                    {product.stock <= 5 ? "Low Stock" : "In Stock"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="trust-section">
        <div className="trust-item">
          <ShieldCheck size={28} />
          <div>
            <h3>Quality Products</h3>
            <p>Reliable hardware from trusted brands.</p>
          </div>
        </div>

        <div className="trust-item">
          <Truck size={28} />
          <div>
            <h3>Local Service</h3>
            <p>Quick and helpful service for your needs.</p>
          </div>
        </div>

        <div className="trust-item">
          <Wrench size={28} />
          <div>
            <h3>Expert Support</h3>
            <p>Get help choosing the right product.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

