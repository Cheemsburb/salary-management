import styles from "./AdminPage.module.css";
import { Link } from "react-router-dom";

function GroupMember() {
  return (
    <div className="container">
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
              <Link to="/admin/admins">
                <i className="fas fa-user-shield"></i> Admin Users
              </Link>
            </li>
            <li>
              <Link to="/group_members" className={styles.active}>
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
      <main className={styles["content"]}>
        <header>
          <h1>
            <i className="fas fa-users"></i> Payroll Management System - Group
            Members
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Our Development Team</h2>
          <p>
            We are a dedicated team of individuals who collaborated to develop
            this Payroll Management System. Our diverse skills and commitment to
            quality have driven the creation of this application.
          </p>
        </section>

        <section className={styles["group-members-list"]}>
          <h2>Team Members</h2>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Molo, Ellen Joy</td>
                  <td>Leader, Design and Layout</td>
                </tr>
                <tr>
                  <td>Espedida, Renz Jasper</td>
                  <td>Front-end Developer</td>
                </tr>
                <tr>
                  <td>Sencil, Gladwyn</td>
                  <td>Back-end Developer</td>
                </tr>
                <tr>
                  <td>Arabe and Damian</td>
                  <td>ERD Diagram Maker</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default GroupMember;
