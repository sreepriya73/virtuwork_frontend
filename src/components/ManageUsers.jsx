import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const ManageUsers = () => {
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

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3030/ausers/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return (
    <div className="container mt-5">
      <h2 className="text-center">Error</h2>
      <p className="text-center text-danger">{error}</p>
    </div>
  );

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Manage Users</h2>
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
                 
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.emailid}</td>
                    <td>{user.role || "N/A"}</td>
                  
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;