
import { useState, type FormEvent } from "react";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { createEnquiry } from "../api/enquiryApi";
import "../styles/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await createEnquiry({
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: formData.message.trim(),
        productId: null,
      });

      setSuccessMessage(
        "Your enquiry has been submitted successfully! Our team will contact you soon."
      );

      setFormData({
        customerName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit enquiry:", error);

      setErrorMessage(
        "We couldn't submit your enquiry. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-header">
        <span>GET IN TOUCH</span>
        <h1>Let's Talk About Your Project</h1>
        <p>
          Need hardware, building materials, or help finding the right
          product? Contact HardwareHub and we'll be happy to help.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon">
              <Phone size={22} />
            </div>
            <div>
              <h3>Call Us</h3>
              <p>Speak directly with our team.</p>
              <a href="tel:+919999999999">+91 99999 99999</a>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3>WhatsApp</h3>
              <p>Send us your product enquiry.</p>
              <a
                href="https://wa.me/?text=Hello%20HardwareHub,%20I%20have%20a%20product%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <Mail size={22} />
            </div>
            <div>
              <h3>Email</h3>
              <p>Send us your requirements.</p>
              <a href="mailto:hardwarehub@example.com">
                hardwarehub@example.com
              </a>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <MapPin size={22} />
            </div>
            <div>
              <h3>Visit Our Store</h3>
              <p>HardwareHub Store</p>
              <span>Ahmedabad, Gujarat</span>
            </div>
          </div>

          <div className="store-hours">
            <Clock size={22} />
            <div>
              <h3>Store Hours</h3>
              <p>Monday – Saturday: 9:00 AM – 8:00 PM</p>
              <p>Sunday: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className="enquiry-form">
          <h2>Send an Enquiry</h2>
          <p>
            Tell us what you need and our team will get back to you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Name</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Your name"
                  value={formData.customerName}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                maxLength={254}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us what products or materials you need..."
                value={formData.message}
                onChange={handleChange}
                maxLength={2000}
                required
              />
            </div>

            {successMessage && (
              <p className="enquiry-success" role="status">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p className="enquiry-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting}>
              <MessageCircle size={19} />
              {isSubmitting ? "Submitting..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;