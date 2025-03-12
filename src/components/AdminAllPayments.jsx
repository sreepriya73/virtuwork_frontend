import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const AdminAllPayments = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/tasks/all");
        setTasks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payment history");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <NavBar />
      <div className="container">
        <header className="header">
          <h2>All Client Payments Overview</h2>
        </header>
        {tasks.length === 0 ? (
          <p className="no-payments">No payment records found.</p>
        ) : (
          <ul className="payment-list">
            {tasks.map((task) => (
              <li key={task._id} className="payment-card">
                <div className="payment-details">
                  <p><strong>Task ID:</strong> {task._id}</p>
                  <p><strong>Client Name:</strong> {task.ClientId?.username || "N/A"}</p>
                  <p><strong>Freelancer:</strong> {task.freelancerId?.username || "N/A"}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Budget:</strong> ${task.budget}</p>
                  <p><strong>Payment Status:</strong> {task.paymentStatus || "pending"}</p>
                  <p><strong>Half Paid At:</strong> {task.halfPaidAt ? new Date(task.halfPaidAt).toLocaleString() : "N/A"}</p>
                  <p><strong>Fully Paid At:</strong> {task.fullyPaidAt ? new Date(task.fullyPaidAt).toLocaleString() : "N/A"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .admin-payments-page {
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #343a40; /* Dark gray for admin theme */
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f8f9fa;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #343a40;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .error-container h2 {
          font-size: 1.8rem;
          color: #dc3545;
          margin-bottom: 10px;
        }

        .error-message {
          font-size: 1.1rem;
          color: #dc3545;
        }

        .no-payments {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .payment-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 20px;
        }

        .payment-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .payment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .payment-details {
          display: grid;
          grid-template-columns: 1fr 1fr; /* Two-column layout */
          gap: 10px 20px;
        }

        .payment-details p {
          margin: 8px 0;
          font-size: 1rem;
          color: #333;
        }

        .payment-details strong {
          color: #343a40;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .header h2 {
            font-size: 1.8rem;
          }

          .payment-card {
            padding: 15px;
          }

          .payment-details {
            grid-template-columns: 1fr; /* Single column on mobile */
          }

          .payment-details p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAllPayments;