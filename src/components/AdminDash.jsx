import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDash = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "View Tasks",
      description: "View all tasks assigned",
      action: () => navigate("/ViewTasks"), // Navigate to View Tasks page
    },
    {
      title: "Acceped Tasks",
      description: "Approve pending tasks",
      action: () => navigate("/ViewAcceptedTasks"), // Navigate to Accept Tasks page
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      action: () => navigate("/FreelancerCinfirmedTask"), // Navigate to Manage Users page
    },
    {
      title: "Generate Reports",
      description: "Generate activity reports",
      action: () => navigate("/generate-reports"), // Navigate to Generate Reports page
    },
    {
      title: "Settings",
      description: "Configure application settings",
      action: () => navigate("/settings"), // Navigate to Settings page
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Admin Dashboard
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={card.action}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 8px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#333" }}>{card.title}</h3>
            <p style={{ color: "#666" }}>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDash;
