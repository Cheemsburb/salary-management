import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AdminPage.module.css";

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, [employees]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/all_payroll")
      .then((res) => {
        setPayroll(res.data);
      })
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, [payroll]);

  const handleDeletePayroll = async (payroll_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this payroll? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/delete_payroll",
        { payroll_id }
      );

      if (data.success) {
        setPayroll((prev) => prev.filter((p) => p.payroll_id !== payroll_id));
        alert("Payroll deleted successfully.");
      } else {
        alert("The server could not delete the payroll. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete payroll:", err);
      alert("Server problem while deleting the payroll.");
    }
  };
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>SMS Admin</h2>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/admin">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/employees">
                <i className="fas fa-users"></i> Employees
              </Link>
            </li>
            <li>
              <Link to="/admin/salary">
                <i className="fas fa-money-bill-wave"></i> Salary Structures
              </Link>
            </li>
            <li>
              <Link to="/admin/payroll" className={styles.active}>
                <i className="fas fa-file-invoice-dollar"></i> Payroll
              </Link>
            </li>
            <li>
              <Link to="/admin/admins">
                <i className="fas fa-user-shield"></i> Admin Users
              </Link>
            </li>
            <li>
              <Link to="/admin/group">
                <i className="fas fa-users"></i> Group Members
              </Link>
            </li>
            <li className={styles.logout}>
              <Link to="/">
                <i className="fas fa-sign-out-alt"></i> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.content}>
        <header>
          <h1>
            <i className="fas fa-file-invoice-dollar"></i> Payroll Management
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Manage Payroll</h2>
          <p>
            This section allows you to initiate payroll runs and view generated
            payroll records.
          </p>
        </section>

        <section className={styles["initiate-payroll"]}>
          <h2>Initiate Payroll Run</h2>
          <form action="#" method="post" className={styles["payroll-run-form"]}>
            {/* Employee selector */}
            <div className={styles["form-group"]}>
              <label htmlFor="employee">Employee *</label>
              <select
                id="employee"
                name="employee"
                required
                className={styles["select-minimal"]}
                value={selectedEmployeeId} // ← controlled
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="" disabled>
                  Select an employee
                </option>
                {employees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {`${e.first_name} ${e.last_name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Pay‑period start */}
            <div className={styles["form-group"]}>
              <label htmlFor="pay_period_start">Pay Period Start Date *</label>
              <input
                type="date"
                id="pay_period_start"
                name="pay_period_start"
                required
              />
            </div>

            {/* Pay‑period end */}
            <div className={styles["form-group"]}>
              <label htmlFor="pay_period_end">Pay Period End Date *</label>
              <input
                type="date"
                id="pay_period_end"
                name="pay_period_end"
                required
              />
            </div>

            {/* Submit */}
            <div
              className={styles["form-actions"]}
              style={{ justifyContent: "flex-start" }}
            >
              <button type="submit" className={styles["submit-button"]}>
                <i className="fas fa-play"></i> Run Payroll
              </button>
            </div>
          </form>
        </section>

        <section className={styles["payroll-records"]}>
          <h2>View Payroll Records</h2>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Payroll ID</th>
                  <th>Pay Period</th>
                  <th># ID Employees</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {payroll.map((payru) => {
                  return (
                    <tr key={payru.payroll_id}>
                      <td>{payru.payroll_id}</td>
                      <td>
                        {new Date(payru.pay_period_start).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(payru.pay_period_end).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td>{payru.employee_id}</td>
                      <td>₱ {payru.net_salary}</td>
                      <td>
                        {payru.status.charAt(0).toUpperCase() +
                          payru.status.slice(1).toLowerCase()}
                      </td>
                      <td>
                        <Link
                          to="/admin/payroll/details"
                          className={
                            styles["action-link"] + " " + styles.details
                          }
                          title="View Details"
                          state={payru}
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                      </td>
                      <td>
                        <button
                          className={styles["x-btn"]}
                          type="button"
                          onClick={() => {
                            handleDeletePayroll(payru.payroll_id);
                          }}
                        ></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Payroll;
