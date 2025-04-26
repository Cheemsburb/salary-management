import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";

function AdminPage() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [highestNetSalary, setHighestNetSalary] = useState(0);
  const [averageSalary, setAverageSalary] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/dashboard")
      .then((res) => {
        const data = res.data[0];
        setEmployeeCount(Math.round(data.total_employees));
        setAverageSalary(Math.round(data.average_net_salary));
        setHighestNetSalary(Math.round(data.highest_net_salary));
      })
      .catch((err) => console.error("Failed to fetch admin data:", err));
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>SMS Admin</h2>
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/admin" className={styles.active}>
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
              <Link to="/admin/payroll">
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
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["dashboard-info"]}>
          <h2>Dashboard Information</h2>
          <p>
            This dashboard provides a quick overview of key metrics and recent
            activities within the Salary Management System. You can see the
            total number of employees, the count of active employees, a summary
            of the latest payroll run including the total amount disbursed and
            the average net salary. Stay informed about new employee
            applications and upcoming payroll deadlines through the
            notifications and alerts section. The quick actions section allows
            you to easily access the most common administrative tasks.
          </p>
        </section>

        <section className={styles["dashboard-overview"]}>
          <h2>Overview</h2>
          <div className={styles.metrics}>
            <div className={styles["metric-card"]}>
              <i className={`fas fa-user-friends ${styles.icon}`}></i>
              <h3>Total Employees</h3>
              <p className={styles.data} id="total-employees">
                {employeeCount}
              </p>
            </div>
            <div className={styles["metric-card"]}>
              <i className={`fas fa-user-check ${styles.icon}`}></i>
              <h3>Active Employees</h3>
              <p className={styles.data} id="active-employees">
                {employeeCount}
              </p>
            </div>
            <div className={styles["metric-card"]}>
              <i className={`fas fa-hand-holding-usd ${styles.icon}`}></i>
              <h3>Highest Net Salary</h3>
              <p className={styles.data} id="latest-payroll-disbursed">
                ₱ {highestNetSalary.toLocaleString()}
              </p>
            </div>
            <div className={styles["metric-card"]}>
              <i className={`fas fa-calculator ${styles.icon}`}></i>
              <h3>Avg. Net Salary (Latest)</h3>
              <p className={styles.data} id="average-net-salary">
                ₱ {averageSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className={styles["quick-actions"]}>
          <h2>
            <i className="fas fa-bolt"></i> Quick Actions
          </h2>
          <div className={styles.actions}>
            <button
              className={styles["action-button"]}
              onClick={() => {
                navigate("/admin/employees");
              }}
            >
              <i className="fas fa-plus"></i> Add New Employee
            </button>
            <button
              className={styles["action-button"]}
              onClick={() => {
                navigate("/admin/payroll");
              }}
            >
              <i className="fas fa-play"></i> Run Payroll
            </button>
            <button
              className={styles["action-button"]}
              onClick={() => {
                navigate("/admin/salary");
              }}
            >
              <i className="fas fa-plus-circle"></i> Add Salary Structure
            </button>
            <Link
              to={"/admin/employees"}
              href="employees.html"
              className={styles["action-link"]}
            >
              <i className="fas fa-eye"></i> View All Employees
            </Link>
            <Link
              to={"/admin/payroll"}
              href="payroll.html"
              className={styles["action-link"]}
            >
              <i className="fas fa-history"></i> View Payroll History
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
