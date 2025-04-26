import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Employee.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function PayrollHistory() {
  const { user } = useContext(UserContext);
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_payroll", {
        id: user.id,
      })
      .then((res) => {
        const data = res.data.result;
        setPayroll(data);
      })

      .catch((err) => console.error("Failed to fetch payroll data:", err));
  }, []);

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
            <Link to="/">
              Logout <i className="fas fa-sign-out-alt"></i>
            </Link>
          </div>
        </aside>

        <main className={styles["dashboard-content"]}>
          <h1>Payroll History</h1>

          <section className={styles["payroll-header-info"]}>
            <h2>{user.name}</h2>
            <p className={styles["employee-position"]}>{user.position}</p>
          </section>

          <section className={styles["payroll-note"]}>
            <p className={styles["section-description"]}>
              <i className="fas fa-info-circle"></i> Below is a history of your
              payroll records. Click 'View Payslip' to see the details for each
              pay period.
            </p>
          </section>

          <section className={styles["payroll-history-section"]}>
            <h2>Past Payrolls</h2>
            <div className={styles["payroll-table-container"]}>
              <table className={styles["payroll-table"]}>
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Gross Salary</th>
                    <th>Total Deductions</th>
                    <th>Total Bonuses</th>
                    <th>Net Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((payrolls) => {
                    return (
                      <tr key={payrolls.payroll_id}>
                        <td>
                          {new Date(
                            payrolls.pay_period_start
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(payrolls.pay_period_end).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </td>

                        <td>₱ {payrolls.gross_salary.toLocaleString()}</td>
                        <td>₱ {payrolls.total_deductions.toLocaleString()}</td>
                        <td>₱ {payrolls.total_bonuses.toLocaleString()}</td>
                        <td>₱ {payrolls.net_salary.toLocaleString()}</td>
                        <td>
                          <Link to="/payroll/payslip" state={payrolls}>
                            <span className={styles["view-payslip-button"]}>
                              <i className="fas fa-file-alt"></i> View Payslip
                            </span>
                          </Link>
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
    </div>
  );
}

export default PayrollHistory;
