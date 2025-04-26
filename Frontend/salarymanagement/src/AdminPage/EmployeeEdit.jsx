import React, { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";
import { Link, useLocation } from "react-router-dom"; // Import Link (Recommended)
import axios from "axios";

function EmployeeEdit() {
  const { state } = useLocation();
  const employee = state;
  const [salary_structure, setSalary_structure] = useState([]);
  const formatDateForInput = (isoDate) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };
  const [formData, setFormData] = useState({
    first_name: employee.first_name,
    last_name: employee.last_name,
    position: employee.position,
    hire_date: formatDateForInput(employee.hire_date),
    salary_structure_id: employee.salary_structure_id,
    username: employee.username,
    password: employee.password,
    access_level: "employee", // default
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/salary_structures")
      .then((res) => {
        setSalary_structure(res.data);
      })
      .catch((err) =>
        console.error("Failed to fetch salary structure data:", err)
      );
  }, [salary_structure]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!confirmUpdate) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/update_employee",
        {
          ...formData,
          employee_id: employee.employee_id,
        }
      );

      if (response.data.success) {
        alert("Employee updated successfully!");
      } else {
        alert("Failed to update employee. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the employee.");
    }
  };

  return (
    <div className={styles["container"]}>
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
              <Link to="/admin/employees" className={styles.active}>
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
      <main className={styles["content"]}>
        <header>
          <h1>
            <i className="fas fa-edit"></i> Edit Employee
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Edit Employee Information</h2>
          <p>
            This section allows you to modify the details of the selected
            employee.
          </p>
        </section>

        <section className={styles["edit-employee-form"]}>
          <h2>Edit Employee Details</h2>
          <form action="#" method="post" className={styles["employee-form"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="hire_date">Hire Date *</label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                required
                value={formData.hire_date}
                onChange={(e) =>
                  setFormData({ ...formData, hire_date: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="salary_structure_id">Salary Structure *</label>
              <select
                id="salary_structure_id"
                name="salary_structure_id"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary_structure_id: e.target.value,
                  })
                }
              >
                <option value="">Select Salary Structure</option>
                {salary_structure.map((salary) => {
                  return (
                    <option
                      value={salary.salary_structure_id}
                      key={salary.salary_structure_id}
                    >
                      {salary.structure_name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="access_level">Access Level *</label>
              <select
                id="access_level"
                name="access_level"
                required
                onChange={(e) =>
                  setFormData({ ...formData, access_level: e.target.value })
                }
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div
              className={styles["form-actions"]}
              style={{ gridColumn: "1 / -1", justifyContent: "flex-start" }}
            >
              <button
                type="submit"
                className={styles["submit-button"]}
                onClick={handleSaveChanges}
              >
                <i className="fas fa-save"></i> Save Changes
              </button>
              <Link
                to={"/admin/employees"}
                href="employees.html"
                className={styles["action-button"] + " " + styles.secondary}
              >
                <i className="fas fa-times"></i> Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EmployeeEdit;
