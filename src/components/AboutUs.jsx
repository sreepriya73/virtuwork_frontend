import React from "react";
import NavBar from "./NavBar";

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>About Us</h1>
          <p className="subtitle">Connecting talent with opportunities</p>
        </header>
        <section className="content">
          <div className="card">
            <h2>Our Mission</h2>
            <p>
              At VIRTUWORK, we aim to empower freelancers and clients by providing a seamless platform for collaboration. Our mission is to bridge the gap between skilled professionals and businesses, fostering a community built on trust, efficiency, and innovation.
            </p>
          </div>
          <div className="card">
            <h2>Who We Are</h2>
            <p>
              We are a dedicated team passionate about revolutionizing the gig economy. With a focus on user-friendly design and robust functionality, VIRTUWORK offers tools to manage tasks, payments, and communication—all in one place.
            </p>
          </div>
          <div className="card">
            <h2>Why Choose Us</h2>
            <ul>
              <li>Secure payment systems</li>
              <li>Efficient task management</li>
              <li>Transparent communication</li>
              <li>Support for freelancers and clients alike</li>
            </ul>
          </div>
          <div className="card">
            <h2>Contact Us</h2>
            <p>
              Have questions or need support? Reach out to us anytime:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:support@virtuwork.com">support@virtuwork.com</a></li>
              <li><strong>Phone:</strong> +1 (800) 123-4567</li>
              <li><strong>Address:</strong> 123 Freelance Lane, Tech City, TC 90210</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .about-us-page {
          background: linear-gradient(135deg, #e6f0fa, #f4f7fc);
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header h1 {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1a3c66;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1.3rem;
          color: #666;
          font-style: italic;
        }

        .content {
          display: grid;
          gap: 30px;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .card h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1a3c66;
          margin-bottom: 15px;
        }

        .card p {
          font-size: 1.1rem;
          color: #333;
          line-height: 1.6;
        }

        .card ul {
          list-style: none;
          padding: 0;
        }

        .card ul li {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 10px;
          position: relative;
          padding-left: 20px;
        }

        .card ul li:before {
          content: "✔";
          color: #007bff;
          position: absolute;
          left: 0;
        }

        .card ul li strong {
          color: #1a3c66;
          font-weight: 600;
        }

        .card ul li a {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .card ul li a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .card {
            padding: 20px;
          }

          .card h2 {
            font-size: 1.5rem;
          }

          .card p, .card ul li {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;