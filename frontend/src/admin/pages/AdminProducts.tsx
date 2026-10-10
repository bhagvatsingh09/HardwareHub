
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Package,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type Product,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "../../api/productApi";

import {
  getCategories,
  type Category,
} from "../../api/categoryApi";

import "../styles/AdminProducts.css";

type ProductFormData = UpdateProductRequest;

const emptyForm: ProductFormData = {
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  stockQuantity: 0,
  unit: "piece",
  imageUrl: null,
  isAvailable: true,
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<ProductFormData>({
    ...emptyForm,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  async function loadProducts(searchTerm = search) {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        search: searchTerm.trim() || undefined,
        page: 1,
        pageSize: 100,
      });

      setProducts(response.items);
    } catch (err) {
      console.error(err);
      setError("Could not load products. Check that the API is running.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    const result = await getCategories();
    setCategories(result.filter((category) => category.isActive));
  }

  useEffect(() => {
    void loadProducts("");

    void loadCategories().catch((err) => {
      console.error(err);
      setError("Could not load categories. Please refresh the page.");
    });
  }, []);

  function openAddForm() {
    setEditingProductId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setImagePreview(null);
    setSelectedImage(null);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProductId(product.id);

    setForm({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      imageUrl: product.imageUrl ?? null,
      isAvailable: product.isAvailable,
    });

    setSelectedImage(null);
    setImagePreview(product.imageUrl ?? null);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingProductId(null);
    setForm({ ...emptyForm });
    setError("");
    setSelectedImage(null);
    setImagePreview(null);
  }

  function updateField<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.onerror = () => {
      setError("Could not preview this image. Please try another file.");
      setImagePreview(null);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setNotice("");

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Please enter a unit, such as piece, box, or kg.");
      return;
    }

    if (!Number.isFinite(form.price) || form.price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (
      !Number.isInteger(form.stockQuantity) ||
      form.stockQuantity < 0
    ) {
      setError("Stock quantity must be a non-negative whole number.");
      return;
    }

    try {
      setSaving(true);

      // Preserve the existing image unless a new one is selected
      // or the user removes it.
      let imageUrl = form.imageUrl;

      // Upload the selected image before saving product details.
      if (selectedImage) {
        const token = sessionStorage.getItem("adminToken");

        if (!token) {
          throw new Error(
            "Your admin session has expired. Please log in again."
          );
        }

        imageUrl = await uploadProductImage(selectedImage, token);
      }

      const payload: ProductFormData = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        unit: form.unit.trim(),
        imageUrl: imageUrl?.trim() || null,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setNotice("Product updated successfully.");
      } else {
        const createPayload: CreateProductRequest = {
          categoryId: payload.categoryId,
          name: payload.name,
          description: payload.description,
          price: payload.price,
          stockQuantity: payload.stockQuantity,
          unit: payload.unit,
          imageUrl: payload.imageUrl,
        };

        await createProduct(createPayload);
        setNotice("Product added successfully.");
      }

      setShowForm(false);
      setEditingProductId(null);
      setForm({ ...emptyForm });
      setSelectedImage(null);
      setImagePreview(null);

      await loadProducts();
    } catch (err: unknown) {
      console.error(err);

      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "Could not save the product. Please try again.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await deleteProduct(product.id);

      setProducts((previous) =>
        previous.filter((item) => item.id !== product.id)
      );

      setNotice(`"${product.name}" was deleted successfully.`);
    } catch (err: unknown) {
      console.error(err);

      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "Could not delete the product. Please try again.";

      setError(message);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your hardware products and their details.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="admin-product-toolbar">
        <form
          className="admin-product-search"
          onSubmit={(event) => {
            event.preventDefault();
            void loadProducts(search);
          }}
        >
          <Search size={18} />

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button type="submit" aria-label="Search products">
            Search
          </button>
        </form>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => void loadProducts()}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {notice && (
        <div className="admin-success-message" role="status">
          {notice}
        </div>
      )}

      {error && !showForm && (
        <div className="admin-error-message" role="alert">
          {error}
        </div>
      )}

      <div className="admin-product-summary">
        <Package size={20} />
        <span>
          {products.length} product{products.length !== 1 ? "s" : ""} shown
        </span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6}>No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-name">
                      <strong>{product.name}</strong>
                      <span>{product.unit}</span>
                    </div>
                  </td>

                  <td>{product.category?.name ?? "Uncategorized"}</td>

                  <td>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td>{product.stockQuantity}</td>

                  <td>
                    <span
                      className={
                        product.isAvailable
                          ? "admin-status-badge available"
                          : "admin-status-badge unavailable"
                      }
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-action-link"
                        onClick={() => openEditForm(product)}
                        title="Edit product"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <Link
                        to={`/products/${product.id}`}
                        className="admin-action-link"
                        title="View product"
                        aria-label={`View ${product.name}`}
                      >
                        <ExternalLink size={16} />
                      </Link>

                      <button
                        type="button"
                        className="admin-action-link danger"
                        onClick={() => void handleDelete(product)}
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="product-form-title">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>

                <p>
                  {editingProductId
                    ? "Update the product information."
                    : "Enter the details of your new product."}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="admin-error-message" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Product Name *
                  <input
                    required
                    maxLength={150}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. LED Bulb 9W"
                  />
                </label>

                <label>
                  Category *
                  <select
                    required
                    value={form.categoryId}
                    onChange={(event) =>
                      updateField("categoryId", event.target.value)
                    }
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="full-width">
                  Description
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the product..."
                  />
                </label>

                <label>
                  Price (₹) *
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Stock Quantity *
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stockQuantity}
                    onChange={(event) =>
                      updateField(
                        "stockQuantity",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Unit *
                  <input
                    required
                    maxLength={30}
                    value={form.unit}
                    onChange={(event) =>
                      updateField("unit", event.target.value)
                    }
                    placeholder="piece, box, kg..."
                  />
                </label>

                <label className="full-width">
                  Product Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />

                  <span className="admin-image-help">
                    JPG, PNG or WebP · Maximum 5 MB
                  </span>

                  {imagePreview && (
                    <div className="admin-image-preview">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                      />

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          updateField("imageUrl", null);
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </label>

                {editingProductId && (
                  <label className="admin-availability-field">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(event) =>
                        updateField("isAvailable", event.target.checked)
                      }
                    />
                    Product is available for customers
                  </label>
                )}
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProductId
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
