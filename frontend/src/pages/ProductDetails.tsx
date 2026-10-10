import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Package,
} from "lucide-react";
import { getProductById, type Product } from "../api/productApi";
import "../styles/product-details.css";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to load product:", error);

        if (!cancelled) {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="product-not-found">
        <h1>Loading product...</h1>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-not-found">
        <h1>Product Not Found</h1>
        <p>{error || "This product does not exist."}</p>

        <Link to="/products">Back to Products</Link>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello HardwareHub, I am interested in ${product.name}. Please share more details and availability.`
  );

  return (
    <main className="product-details-page">
      <Link to="/products" className="back-products">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <section className="product-details">
        <div className="details-image">
          <img
            src={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.name}
          />
        </div>

        <div className="details-content">
          <span className="details-category">
            {product.category?.name || "Hardware"}
          </span>

          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description || "Quality hardware product available at HardwareHub."}
          </p>

          <div className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
            <span> / {product.unit}</span>
          </div>

          <div className="details-stock">
            <CheckCircle size={20} />
            {product.stockQuantity} {product.unit}
            {product.stockQuantity !== 1 ? "s" : ""} available
          </div>

          <div className="details-actions">
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <MessageCircle size={20} />
              Enquire on WhatsApp
            </a>

            <div className="availability">
              <Package size={18} />
              {product.isAvailable
                ? "Available in store"
                : "Currently unavailable"}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;