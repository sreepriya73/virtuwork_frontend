import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const PaymentPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const rating = location.state?.rating; // Get rating from navigation state

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          window.location.href = "/SignIn";
          return;
        }

        const response = await axios.get("http://localhost:3030/tasks/client-confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData = response.data.find((t) => t._id === taskId);
        if (!taskData) throw new Error("Task not found");
        setTask(taskData);
      } catch (err) {
        setError(err.message || "Failed to fetch task details");
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const simulatePayment = async (method) => {
    try {
      const token = sessionStorage.getItem("token");
      const endpoint = task.paymentStatus === "pending" ? `/tasks/half-payment/${taskId}` : `/tasks/full-payment/${taskId}`;
      const payload = task.paymentStatus === "pending" ? {} : { rating }; // Include rating for final payment
      const response = await axios.put(
        `http://localhost:3030${endpoint}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTask({
        ...task,
        paymentStatus: task.paymentStatus === "pending" ? "half paid" : "fully paid",
        [task.paymentStatus === "pending" ? "halfPaidAt" : "fullyPaidAt"]: new Date(),
        ...(task.paymentStatus !== "pending" && { rating }),
      });
      alert(`Payment simulated successfully via ${method}! ${response.data.message}`);
      navigate("/confirmed-tasks");
    } catch (error) {
      console.error("Error simulating payment:", error);
      alert("Payment simulation failed: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error || !task) return (
    <div className="container mt-5">
      <h2 className="text-center">Error</h2>
      <p className="text-center text-danger">{error || "Task not found"}</p>
    </div>
  );

  const paymentAmount = task.paymentStatus === "pending" ? task.budget / 2 : task.budget / 2;

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Make Payment for Task</h2>
        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <h4>Task Details</h4>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Freelancer:</strong> {task.freelancerId?.username || "N/A"}</p>
          <p><strong>Total Budget:</strong> ${task.budget}</p>
          <p><strong>Amount to Pay:</strong> ${paymentAmount} ({task.paymentStatus === "pending" ? "Half Payment" : "Final Payment"})</p>
          <p><strong>Payment Status:</strong> {task.paymentStatus || "pending"}</p>
          {task.paymentStatus !== "pending" && rating && (
            <p><strong>Rating:</strong> {rating} / 5</p>
          )}

          <hr />

          <h4 className="mt-4">Payment Options</h4>

          <div className="mb-4">
            <h5>Pay with Google Pay</h5>
            <p>Scan this dummy QR code (simulation only):</p>
            <img
              src="https://www.qrcode-monkey.com/img/default-preview-qr.svg"
              alt="Google Pay QR Code"
              className="img-fluid mb-3"
              style={{ maxWidth: "200px", display: "block", margin: "0 auto" }}
            />
            <button
              className="btn btn-success w-100"
              onClick={() => simulatePayment("Google Pay")}
              disabled={task.paymentStatus === "fully paid"}
            >
              Simulate Google Pay Payment
            </button>
          </div>

          <div className="text-center my-4">
            <h5 className="text-muted">OR</h5>
          </div>

          <div className="mb-4">
            <h5>Pay with Credit/Debit Card</h5>
            <form onSubmit={(e) => { e.preventDefault(); simulatePayment("Card"); }}>
              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="expiry" className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    id="expiry"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cvv" className="form-label">CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={task.paymentStatus === "fully paid"}
              >
                Simulate Card Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;