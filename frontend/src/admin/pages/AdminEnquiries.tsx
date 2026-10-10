
import { useCallback, useEffect, useState } from "react";
import { MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import axios from "axios";
import {
  type Enquiry,
} from "../../api/enquiryApi";
import "../../admin/styles/adminEnquiries.css";

const API_URL = "http://localhost:5095/api/Enquiries";

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Enquiry[]>(API_URL);
      setEnquiries(response.data);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setError("Could not load enquiries. Please check that the API is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setError("");

    try {
      await axios.put(`${API_URL}/${id}/status`, { status });
      await loadEnquiries();
    } catch (err) {
      console.error("Failed to update enquiry:", err);
      setError("Could not update the enquiry status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteEnquiry(id: string) {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) {
      return;
    }

    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      setEnquiries((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      setError("Could not delete the enquiry.");
    }
  }

  const newCount = enquiries.filter((item) => item.status === "New").length;
  const contactedCount = enquiries.filter(
    (item) => item.status === "Contacted"
  ).length;
  const resolvedCount = enquiries.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="admin-enquiries">
      <header className="enquiries-header">
        <div>
          <h1>Customer Enquiries</h1>
          <p>Review customer requests and manage follow-ups.</p>
        </div>

        <button
          type="button"
          className="enquiries-refresh"
          onClick={() => void loadEnquiries()}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      <section className="enquiries-stats">
        <article>
          <span>Total Enquiries</span>
          <strong>{enquiries.length}</strong>
        </article>
        <article>
          <span>New</span>
          <strong>{newCount}</strong>
        </article>
        <article>
          <span>Contacted</span>
          <strong>{contactedCount}</strong>
        </article>
        <article>
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </article>
      </section>

      {error && <p className="enquiries-error" role="alert">{error}</p>}

      {loading ? (
        <p className="enquiries-message">Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <div className="enquiries-empty">
          <MessageCircle size={36} />
          <h2>No enquiries yet</h2>
          <p>Customer submissions will appear here.</p>
        </div>
      ) : (
        <section className="enquiries-list">
          {enquiries.map((item) => (
            <article className="enquiry-item" key={item.id}>
              <div className="enquiry-item-header">
                <div>
                  <h2>{item.customerName}</h2>
                  <span className="enquiry-date">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <span
                  className={`enquiry-status enquiry-status-${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="enquiry-contact-details">
                <a href={`tel:${item.phone}`}>{item.phone}</a>
                {item.email && (
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                )}
              </div>

              <p className="enquiry-product">
                Product: {item.productName || "General enquiry"}
              </p>

              <p className="enquiry-message">{item.message}</p>

              <div className="enquiry-actions">
                <label>
                  Status
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(event) =>
                      void updateStatus(item.id, event.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>

                <a
                  className="enquiry-whatsapp"
                  href={`https://wa.me/${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${item.customerName}, regarding your HardwareHub enquiry: ${item.message}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>

                <button
                  type="button"
                  className="enquiry-delete"
                  onClick={() => void deleteEnquiry(item.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default AdminEnquiries;
