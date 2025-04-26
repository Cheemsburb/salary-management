import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Employee.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function EmployeePage() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
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
                <span className={styles["label"]}>Pay Period:</span> April 01 -
                April 15, 2025
              </p>
              <p>
                <span className={styles["label"]}>Gross Salary:</span> ₱
                30,000.00
              </p>
              <p>
                <span className={styles["label"]}>Total Deductions:</span> ₱
                5,000.00
              </p>
              <p>
                <span className={styles["label"]}>Total Bonuses:</span> ₱
                1,000.00
              </p>
              <p>
                <span className={styles["label"]}>Net Salary:</span>{" "}
                <span className={styles["net-pay"]}>₱ 26,000.00</span>
              </p>
              <a
                href="payroll_history.html"
                className={styles["view-full-history"]}
              >
                <i className="fas fa-history"></i> View Full Payroll History
              </a>
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
