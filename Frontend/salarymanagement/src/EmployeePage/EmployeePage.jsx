import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Employee.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function EmployeePage() {
  const { user } = useContext(UserContext);

  const [payroll, setPayroll] = useState({
    employee_id: "not available",
    pay_period_start: "not available",
    pay_period_end: "not available",
    gross_salary: "not available",
    total_deductions: "not available",
    total_bonuses: "not available",
    net_salary: "not available",
    status: "not available",
  });

  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_payroll_latest", {
        id: user.id,
      })
      .then((res) => {
        const data = res.data.result?.[0];
        if (data) {
          setPayroll(data);
        } else {
          console.warn("No payroll data found. Keeping defaults.");
        }
      })

      .catch((err) => console.error("Failed to fetch payroll data:", err));
  }, []);

  useEffect(() => {
    console.log(payroll);
  }, [payroll]);
  return (
    <div className={styles["boody"]}>
      <header className={styles["main-header"]}>
        <div className={styles["header-branding"]}>
          <h1>Payroll Management System</h1>
        </div>
        <div className={styles["header-welcome"]}>Welcome, {user.name}</div>
      </header>

      <div className={styles["container"]}>
        <aside className={styles["sidebar"]}>
          <h2>Navigation</h2>
          <ul>
            <li>
              <Link to="/employee">
                <i className="fas fa-home"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/employee/info">
                <i className="fas fa-user"></i> Personal Info
              </Link>
            </li>
            <li>
              <Link to="/employee/payroll" className="active">
                <i className="fas fa-history"></i> Payroll History
              </Link>
            </li>
          </ul>

          <div className={styles["sidebar-logout"]}>
            <Link href="#" to={"/"}>
              Logout <i className="fas fa-sign-out-alt"></i>
            </Link>
          </div>
        </aside>

        <main className={styles["dashboard-content"]}>
          <h1>Dashboard</h1>

          <section
            className={
              styles["overview-section"] + " " + styles["welcome-section"]
            }
          >
            <h3>
              <i className="fas fa-bullhorn"></i> Welcome!
            </h3>
            <p>
              This is your employee dashboard. Here you can find a quick
              overview of important information.
            </p>
          </section>

          <section
            className={
              styles["overview-section"] +
              " " +
              styles["latest-payroll-section"]
            }
          >
            <h3>
              <i className="fas fa-money-bill-wave"></i> Latest Payroll
              Information
            </h3>
            <div className={styles["payroll-summary"]}>
              <p>
                <span className={styles["label"]}>Pay Period:</span>{" "}
                {payroll.pay_period_start !== "not available" &&
                payroll.pay_period_end !== "not available" ? (
                  <>
                    {
                      new Date(payroll.pay_period_start)
                        .toISOString()
                        .split("T")[0]
                    }{" "}
                    -{" "}
                    {
                      new Date(payroll.pay_period_end)
                        .toISOString()
                        .split("T")[0]
                    }
                  </>
                ) : (
                  "Not available"
                )}
              </p>
              <p>
                <span className={styles["label"]}>Gross Salary:</span>{" "}
                {payroll.gross_salary !== "not available"
                  ? `₱${payroll.gross_salary}`
                  : "Not available"}
              </p>
              <p>
                <span className={styles["label"]}>Total Deductions:</span>{" "}
                {payroll.total_deductions !== "not available"
                  ? `₱${payroll.total_deductions}`
                  : "Not available"}
              </p>
              <p>
                <span className={styles["label"]}>Total Bonuses:</span>{" "}
                {payroll.total_bonuses !== "not available"
                  ? `₱${payroll.total_bonuses}`
                  : "Not available"}
              </p>
              <p>
                <span className={styles["label"]}>Net Salary:</span>{" "}
                <span className={styles["net-pay"]}>
                  {payroll.net_salary !== "not available"
                    ? `₱${payroll.net_salary}`
                    : "Not available"}
                </span>
              </p>
              <Link
                to={"/employee/payroll"}
                href="payroll_history.html"
                className={styles["view-full-history"]}
              >
                <i className="fas fa-history"></i> View Full Payroll History
              </Link>
            </div>
          </section>

          <section
            className={
              styles["overview-section"] + " " + styles["quick-links-section"]
            }
          >
            <h3>
              <i className="fas fa-link"></i> Quick Links
            </h3>
            <ul>
              <li>
                <Link href="personal_info.html" to={"/employee/info"}>
                  <i className="fas fa-user-cog"></i> View Personal Information
                </Link>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

export default EmployeePage;
