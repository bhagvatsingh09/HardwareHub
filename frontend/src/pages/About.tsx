import {
  Award,
  Boxes,
  Handshake,
  ShieldCheck,
  Users,
} from "lucide-react";
import "../styles/about.css";

const values = [
  {
    icon: ShieldCheck,
    title: "Quality Products",
    description:
      "We focus on providing reliable hardware and building materials that customers can trust.",
  },
  {
    icon: Handshake,
    title: "Trusted Service",
    description:
      "Our goal is to make buying hardware simple, transparent and convenient.",
  },
  {
    icon: Boxes,
    title: "Wide Selection",
    description:
      "From construction materials to tools and hardware, we aim to keep essential products available.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We help customers find the right product for their project and requirements.",
  },
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span>ABOUT HARDWAREHUB</span>

        <h1>
          Your Trusted Partner for
          <strong> Hardware & Building Materials</strong>
        </h1>

        <p>
          HardwareHub is built to make it easier for customers,
          contractors and professionals to find quality hardware,
          tools and building materials in one place.
        </p>
      </section>

      <section className="about-story">
        <div className="about-story-content">
          <span>WHO WE ARE</span>

          <h2>Built Around Real Hardware Needs</h2>

          <p>
            Finding the right hardware product should not be complicated.
            HardwareHub brings products, availability and customer
            enquiries together in one simple platform.
          </p>

          <p>
            Whether you are working on a home project, construction site
            or professional job, our goal is to help you find the
            materials and tools you need quickly.
          </p>
        </div>

        <div className="about-highlight">
          <Award size={42} />

          <h3>Reliable Products</h3>

          <p>
            Quality materials and practical solutions for everyday
            construction and hardware needs.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-heading">
          <span>WHY HARDWAREHUB</span>

          <h2>What We Stand For</h2>

          <p>
            Our platform is designed around the things that matter most
            when buying hardware.
          </p>
        </div>

        <div className="values-grid">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div className="value-card" key={value.title}>
                <div className="value-icon">
                  <Icon size={25} />
                </div>

                <h3>{value.title}</h3>

                <p>{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="about-cta">
        <h2>Looking for the right hardware?</h2>

        <p>
          Browse our products or contact us with your requirements.
        </p>

        <div className="about-actions">
          <a href="/products">Browse Products</a>

          <a href="/contact">Contact Us</a>
        </div>
      </section>
    </main>
  );
}

export default About;