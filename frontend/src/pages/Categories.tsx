import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FolderOpen } from "lucide-react";
import { getCategories, type Category } from "../api/categoryApi";
import "../styles/categories.css";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        // Customers should only see active categories.
        setCategories(data.filter((category) => category.isActive));
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Unable to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <main className="categories-page">
        <h1>Loading categories...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="categories-page">
        <h1>Categories</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="categories-page">
      <section className="categories-header">
        <span className="categories-label">HARDWAREHUB</span>

        <h1>Browse Categories</h1>

        <p>
          Explore our range of hardware and building materials.
        </p>
      </section>

      {categories.length > 0 ? (
        <section className="categories-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <div className="category-icon">
                <FolderOpen size={30} />
              </div>

              <div className="category-content">
                <h2>{category.name}</h2>

                <p>
                  {category.description ||
                    "Quality products and accessories."}
                </p>

                <Link to={`/products?categoryId=${category.id}`}>
                  View Products
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="no-categories">
          <FolderOpen size={42} />
          <h2>No active categories available</h2>
          <p>Please check back later for available products.</p>
        </div>
      )}
    </main>
  );
}

export default Categories;

