import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AdminPage.module.css";

function Admin() {
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
              <Link to="/admin/payroll">
                <i className="fas fa-file-invoice-dollar"></i> Payroll
              </Link>
            </li>
            <li>
              <Link to="/admin/admins" className={styles.active}>
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
            <i className="fas fa-user-shield"></i> Admin User Management
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Manage Admin Users</h2>
          <p>This section allows you to view the information of the admin</p>
        </section>

        <section className={styles["admin-user-list"]}>
          <h2>Admin Information</h2>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Access Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>admin</td>
                  <td>adminpass123</td>
                  <td>Admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
