import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3030/ausers");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="loading-container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Error</h2>
        <p className="text-center text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">All Users</h2>
        {users.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                 
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.emailid}</td>
                    <td>{user.role || "N/A"}</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }
        .table-responsive {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .table {
          margin-bottom: 0;
        }
        .thead-dark {
          background: linear-gradient(90deg, #1a3c66, #2e5b99);
          color: white;
        }
        .thead-dark th {
          font-weight: 600;
          text-align: center;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: #f8f9fa;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #dee2e6;
          padding: 12px;
          text-align: center;
        }
        .table-bordered td {
          vertical-align: middle;
        }
        .text-center {
          text-align: center;
        }
        .mt-5 {
          margin-top: 3rem;
        }
        .mb-4 {
          margin-bottom: 1.5rem;
        }
        .text-danger {
          color: #dc3545;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default ViewUsers;