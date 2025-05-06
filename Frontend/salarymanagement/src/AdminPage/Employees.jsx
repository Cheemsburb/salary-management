import React, { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [salary_structure, setSalary_structure] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    position: "",
    hire_date: "",
    salary_structure_id: "",
    username: "",
    password: "",
    access_level: "employee",
  });

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
      .get("http://localhost:3000/admin/salary_structures")
      .then((res) => {
        setSalary_structure(res.data);
      })
      .catch((err) =>
        console.error("Failed to fetch salary structure data:", err)
      );
  }, [salary_structure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/add_employee",
        formData
      );

      if (res.data.success) {
        alert(res.data.message || "Employee added successfully!");

        setEmployees([...employees, formData]);

        setFormData({
          first_name: "",
          last_name: "",
          position: "",
          hire_date: "",
          salary_structure_id: "",
          username: "",
          password: "",
          access_level: "employee",
        });
      } else {
        alert(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
        alert(
          err.response.data.message || "Failed to add employee (server error)"
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("No response from server. Please check your connection.");
      } else {
        console.error("Request error:", err.message);
        alert("Unexpected error: " + err.message);
      }
    }
  };

  const handleDelete = async (e, employee_id) => {
    e.preventDefault();

    const ok = window.confirm(
      `Delete employee #${employee_id}?  This can’t be undone.`
    );
    if (!ok) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/delete_employee",
        { employee_id }
      );

      if (res.data?.success) {
        setEmployees((prev) =>
          prev.filter((emp) => emp.employee_id !== employee_id)
        );
        alert(res.data.message || "Employee deleted.");
      } else {
        alert(res.data?.message || "Could not delete employee.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        alert(err.response.data?.message || "Server rejected the request.");
      } else if (err.request) {
        console.error("No server response:", err.request);
        alert("No response from server. Check your connection.");
      } else {
        console.error("Request setup error:", err.message);
        alert("Unexpected error: " + err.message);
      }
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
      <main className={styles.content}>
        <header>
          <h1>
            <i className="fas fa-users"></i> Employee Management
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Manage Employees</h2>
          <p>
            This section allows you to view, add, edit, and manage employee
            information within the Salary Management System. You can see a list
            of all employees and add new employee records.
          </p>
        </section>

        <section className={styles["employee-list"]}>
          <h2>Employee List</h2>
          <div className={styles["list-header"]}>
            <div className={styles["search-container"]}>
              <input
                type="text"
                id="employee-search"
                placeholder="Search employee here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button className={styles["search-button"]}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div className={styles["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Salary Structure ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Position</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter((emp) =>
                    `${emp.employee_id} ${emp.first_name} ${emp.last_name} ${emp.position} ${emp.username}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((emp) => (
                    <tr key={emp.employee_id}>
                      <td>{emp.employee_id}</td>
                      <td>{emp.salary_structure_id}</td>
                      <td>{emp.first_name}</td>
                      <td>{emp.last_name}</td>
                      <td>{emp.position}</td>
                      <td>{emp.username}</td>
                      <td>{emp.password}</td>
                      <td>
                        <Link
                          to={"/admin/employees/edit"}
                          state={emp}
                          className={styles["action-link"] + " " + styles.edit}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button
                          className={
                            styles["action-button"] + " " + styles.deactivate
                          }
                          onClick={(e) => handleDelete(e, emp.employee_id)}
                        >
                          <i className="fas fa-check-circle"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles["create-employee"]}>
          <h2>Add New Employee</h2>
          <form method="post" className={styles["employee-form"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
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
                className={styles["submit-button"]}
                onClick={handleSubmit}
              >
                <i className="fas fa-plus"></i> Add Employee
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Employees;
