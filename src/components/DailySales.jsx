import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const DailySales = () => {
  const [sales, setSales] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDailySales = async () => {
      try {
        const response = await axios.get("http://localhost:3030/daily-sales");
        setSales(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch daily sales");
        console.error("Error fetching daily sales:", err);
        setLoading(false);
      }
    };

    fetchDailySales();
  }, []);

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
        <h2 className="text-center mb-4">Daily Sales (Payment Transactions)</h2>
        {Object.keys(sales).length === 0 ? (
          <p className="text-center">No sales recorded.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Date</th>
                  <th>Total Transactions</th>
                  <th>Total Base Amount</th>
                  <th>Total Platform Charge</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sales).map(([date, data]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{data.transactions}</td>
                    <td>${data.baseAmount.toFixed(2)}</td>
                    <td>${data.platformCharge.toFixed(2)}</td>
                    <td>${(data.baseAmount + data.platformCharge).toFixed(2)}</td>
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

export default DailySales;