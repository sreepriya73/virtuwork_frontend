import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const AdminDash = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "View Tasks",
      description: "View all tasks assigned",
      action: () => navigate("/ViewTasks"),
    },
    {
      title: "Accepted Tasks",
      description: "Approve pending tasks",
      action: () => navigate("/ViewAcceptedTasks"),
    },
    {
      title: "View Payments",
      description: "View and manage payments",
      action: () => navigate("/AdminAllPayments"),
    },
    {
      title: "Freelancer Confirmed Task Details",
      description: "View confirmed task details",
      action: () => navigate("/FreelancerConfirmedTask"),
    },
    {
      title: "Reward Point Redemption Details",
      description: "View reward point redemptions",
      action: () => navigate("/view-redeemed-points"),
    },
    {
      title: "Platform Charges",
      description: "View platform charges",
      action: () => navigate("/admin-platform-charges"),
    },
    {
      title: "View Users",
      description: "View all user details",
      action: () => navigate("/view-users"),
    },
    {
      title: "Manage Users",
      description: "Delete user accounts",
      action: () => navigate("/manage-users"),
    },
    {
      title: "Daily Sales",
      description: "View daily payment transactions",
      action: () => navigate("/daily-sales"),
    },
  ];

  // Logout handler
  const handleLogout = () => {
    sessionStorage.clear();
    alert("Logged out successfully!");
    navigate("/SignIn");
  };

  return (
    <div className="admin-dash-page">
      <NavBar />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="card-grid">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={card.action}
            >
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        {/* Added Logout Section */}
        <section className="logout-section">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </div>

      {/* Professional and Attractive CSS */}
      <style jsx>{`
        .admin-dash-page {
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #343a40; /* Dark gray for admin theme */
          margin-bottom: 40px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        .dashboard-card {
          background: #fff;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .dashboard-card h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #343a40;
          margin-bottom: 12px;
        }

        .dashboard-card p {
          font-size: 1rem;
          color: #6c757d;
          line-height: 1.5;
          margin: 0;
        }

        /* Added Logout Section Styles */
        .logout-section {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .btn-logout {
          padding: 10px 20px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          background: #dc3545; /* Red for logout */
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .btn-logout:hover {
          background: #c82333;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }

          .dashboard-container {
            padding: 30px 15px;
          }

          .card-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }

          .dashboard-card {
            padding: 20px;
          }

          .dashboard-card h3 {
            font-size: 1.2rem;
          }

          .dashboard-card p {
            font-size: 0.95rem;
          }

          .btn-logout {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDash;