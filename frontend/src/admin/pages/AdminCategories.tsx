
import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  getCategories,
  setCategoryStatus,
  updateCategory,
  type Category,
  type CategoryRequest,
} from "../../api/categoryApi";
import "../styles/adminCategories.css";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: string | { message?: string; title?: string };
        };
      }
    ).response;

    if (typeof response?.data === "string") {
      return response.data;
    }

    if (response?.data && typeof response.data === "object") {
      return (
        response.data.message ||
        response.data.title ||
        "The request could not be completed."
      );
    }
  }

  return "Unable to connect to the server. Check that the backend is running.";
}

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] = useState<CategoryRequest>({
    name: "",
    description: "",
  });

  async function loadCategories() {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(term) ||
        (category.description ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter(
    (category) => category.isActive
  ).length;

  function openCreateModal() {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingCategory(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Please enter a category name.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const request = { name, description };

      if (editingCategory) {
        await updateCategory(editingCategory.id, request);
        setSuccess("Category updated successfully.");
      } else {
        await createCategory(request);
        setSuccess("Category created successfully.");
      }

      setModalOpen(false);
      setEditingCategory(null);
      setForm({ name: "", description: "" });
      await loadCategories();

      setSuccess(
        editingCategory
          ? "Category updated successfully."
          : "Category created successfully."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusToggle(category: Category) {
    const action = category.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${category.name}"?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await setCategoryStatus(category.id, !category.isActive);

      setCategories((current) =>
        current.map((item) =>
          item.id === category.id
            ? { ...item, isActive: !category.isActive }
            : item
        )
      );

      setSuccess(
        `"${category.name}" ${category.isActive ? "deactivated" : "activated"} successfully.`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="category-admin">
      <div className="category-page-header">
        <div>
          <p className="category-eyebrow">INVENTORY MANAGEMENT</p>
          <h1>Categories</h1>
          <p className="category-subtitle">
            Organize the products in your hardware store.
          </p>
        </div>

        <button
          className="category-primary-button"
          onClick={openCreateModal}
        >
          <span aria-hidden="true">+</span> Add Category
        </button>
      </div>

      <div className="category-stats">
        <div className="category-stat-card">
          <span>Total Categories</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="category-stat-card">
          <span>Active Categories</span>
          <strong>{activeCount}</strong>
        </div>
        <div className="category-stat-card">
          <span>Inactive Categories</span>
          <strong>{categories.length - activeCount}</strong>
        </div>
      </div>

      {error && (
        <div className="category-alert category-alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="category-alert category-alert-success" role="status">
          {success}
        </div>
      )}

      <section className="category-panel">
        <div className="category-toolbar">
          <div>
            <h2>All Categories</h2>
            <p>Manage your store's product groups.</p>
          </div>

          <div className="category-filters">
            <input
              type="search"
              placeholder="Search categories..."
              aria-label="Search categories"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="category-refresh-button"
              onClick={() => void loadCategories()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="category-empty-state">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="category-empty-state">
            <div className="category-empty-icon">▦</div>
            <h3>
              {categories.length === 0
                ? "No categories yet"
                : "No matching categories"}
            </h3>
            <p>
              {categories.length === 0
                ? "Create your first category to organize your products."
                : "Try a different search term or status filter."}
            </p>
            {categories.length === 0 && (
              <button
                className="category-primary-button"
                onClick={openCreateModal}
              >
                Add your first category
              </button>
            )}
          </div>
        ) : (
          <div className="category-table-wrapper">
            <table className="category-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="category-name-cell">
                        <span className="category-avatar">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <strong>{category.name}</strong>
                          <small>
                            ID: {category.id.slice(0, 8)}...
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="category-description-cell">
                      {category.description || "—"}
                    </td>

                    <td>
                      <span
                        className={`category-status ${
                          category.isActive ? "is-active" : "is-inactive"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="category-row-actions">
                        <button
                          className="category-edit-button"
                          onClick={() => openEditModal(category)}
                        >
                          Edit
                        </button>
                        <button
                          className={
                            category.isActive
                              ? "category-deactivate-button"
                              : "category-activate-button"
                          }
                          onClick={() => void handleStatusToggle(category)}
                        >
                          {category.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="category-panel-footer">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </section>

      {modalOpen && (
        <div
          className="category-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="category-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
          >
            <div className="category-modal-header">
              <div>
                <p className="category-eyebrow">
                  CATEGORY MANAGEMENT
                </p>
                <h2 id="category-modal-title">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
              </div>

              <button
                className="category-close-button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="category-name">Category Name *</label>
              <input
                id="category-name"
                type="text"
                maxLength={100}
                placeholder="e.g. Electrical"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
                autoFocus
              />

              <label htmlFor="category-description">Description</label>
              <textarea
                id="category-description"
                rows={4}
                maxLength={500}
                placeholder="Briefly describe this category..."
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />

              {error && (
                <div
                  className="category-alert category-alert-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="category-modal-actions">
                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="category-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;