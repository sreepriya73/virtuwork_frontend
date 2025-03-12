import React from "react";
import NavBar from "./NavBar";

const HowToUse = () => {
  return (
    <div className="how-to-use-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h1>How to Use VIRTUWORK</h1>
          <p className="subtitle">Your guide to getting started</p>
        </header>
        <section className="content">
          <div className="step-card">
            <h2>Step 1: Register</h2>
            <p>
              Create an account as a user or admin via the "Register" dropdown in the navigation bar. Fill in your details and get started.
            </p>
          </div>
          <div className="step-card">
            <h2>Step 2: Login</h2>
            <p>
              Use the "Login" dropdown to sign in as a user or admin. Once logged in, you’ll have access to your dashboard.
            </p>
          </div>
          <div className="step-card">
            <h2>Step 3: Post or Find Tasks</h2>
            <p>
              Clients can post tasks with descriptions, budgets, and deadlines. Freelancers can browse and accept tasks that match their skills.
            </p>
          </div>
          <div className="step-card">
            <h2>Step 4: Manage Tasks</h2>
            <p>
              Track task progress, submit work, and approve submissions. Admins can oversee all tasks and payments from their dashboard.
            </p>
          </div>
          <div className="step-card">
            <h2>Step 5: Payments & Rewards</h2>
            <p>
              Clients make payments (half or full) upon task milestones. Freelancers earn rewards and can redeem points as configured.
            </p>
          </div>
        </section>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .how-to-use-page {
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

        .step-card {
          background: #fff;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .step-card h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1a3c66;
          margin-bottom: 15px;
        }

        .step-card p {
          font-size: 1.1rem;
          color: #333;
          line-height: 1.6;
        }

        .step-card:before {
          content: counter(step);
          counter-increment: step;
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 1.2rem;
          font-weight: bold;
          color: #007bff;
        }

        .content {
          counter-reset: step;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .step-card {
            padding: 20px;
          }

          .step-card h2 {
            font-size: 1.5rem;
          }

          .step-card p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HowToUse;