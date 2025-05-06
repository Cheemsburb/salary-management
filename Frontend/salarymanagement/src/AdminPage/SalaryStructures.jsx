import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AdminPage.module.css";
import localStyle from "./SalaryStructures.module.css";

function SalaryStructures() {
  const [salary_structure, setSalary_structure] = useState([]);
  const [formData, setFormData] = useState({
    structure_name: "",
    base_salary: 0,
    tax_rate: 0,
    sss_contribution: 0,
    philhealth_contribution: 0,
    pagibig_contribution: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/add_salary_structure",
        formData
      );

      if (res.data.success) {
        alert(res.data.message || "Salary added successfully!");

        setSalary_structure([...salary_structure, formData]);

        setFormData({
          structure_name: "",
          base_salary: 0,
          tax_rate: 0,
          sss_contribution: 0,
          philhealth_contribution: 0,
          pagibig_contribution: 0,
        });
      } else {
        alert(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
        alert(
          err.response.data.message ||
            "Failed to add salary structure (server error)"
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

  const handleDelete = async (e, salary_structure_id) => {
    e.preventDefault();

    if (!window.confirm("Delete this salary structure?")) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/delete_salary_structure",
        { salary_structure_id }
      );

      alert(res.data.message || "Salary structure deleted.");

      setSalary_structure(
        salary_structure.filter(
          (s) => s.salary_structure_id !== salary_structure_id
        )
      );
    } catch (err) {
      if (err.response) {
        const status = err.response.status;

        if (status === 409) {
          alert(
            err.response.data.message ||
              "Cannot delete this structure because it is still assigned to employees."
          );
        } else if (status === 404) {
          alert(
            err.response.data.message || "Salary structure not found on server."
          );

          setSalary_structure(
            salary_structure.filter(
              (s) => s.salary_structure_id !== salary_structure_id
            )
          );
        } else {
          console.error("Server error:", err.response.data);
          alert(
            err.response.data.message ||
              "Server error while deleting salary structure."
          );
        }
      } else if (err.request) {
        console.error("No response:", err.request);
        alert("No response from server. Check your connection.");
      } else {
        console.error("Error:", err.message);
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
              <Link to="/admin/employees">
                <i className="fas fa-users"></i> Employees
              </Link>
            </li>
            <li>
              <Link to="/admin/salary" className={styles.active}>
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
            <i className="fas fa-money-bill-wave"></i> Salary Structure
            Management
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["dashboard-info"]}>
          <h2>Manage Salary Structures</h2>
          <p>
            This section allows you to view, create, and edit salary structures.
            Each structure defines the base salary, tax rate, and fixed
            contributions that can be assigned to employees.
          </p>
        </section>

        <section className={localStyle["salary-structure-list"]}>
          <h2>Salary Structure List</h2>
          <div className={localStyle["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Structure ID</th>
                  <th>Structure Name</th>
                  <th>Base Salary</th>
                  <th>Tax Rate (%)</th>
                  <th>SSS Contribution</th>
                  <th>PhilHealth Contribution</th>
                  <th>Pag-IBIG Contribution</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salary_structure.map((salary) => {
                  return (
                    <tr key={salary.salary_structure_id}>
                      <td>{salary.salary_structure_id}</td>
                      <td>{salary.structure_name}</td>
                      <td>₱ {salary.base_salary}</td>
                      <td>{salary.tax_rate} %</td>
                      <td>₱ {salary.sss_contribution}</td>
                      <td>₱ {salary.philhealth_contribution}</td>
                      <td>₱ {salary.pagibig_contribution}</td>
                      <td>
                        <Link
                          to={"/admin/salary/edit"}
                          state={salary}
                          href="edit_salary_structures.html"
                          className={`${localStyle["action-link"]} ${localStyle["edit"]}`}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button
                          className={`${localStyle["action-button"]} ${localStyle["delete"]}`}
                          onClick={(e) => {
                            handleDelete(e, salary.salary_structure_id);
                          }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className={localStyle["create-salary-structure"]}>
          <h2>Create New Salary Structure</h2>
          <form
            action="#"
            method="post"
            className={localStyle["salary-structure-form"]}
          >
            <div className={localStyle["form-group"]}>
              <label htmlFor="structure_name">Structure Name *</label>
              <input
                type="text"
                id="structure_name"
                name="structure_name"
                required
                value={formData.structure_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    structure_name: e.target.value,
                  })
                }
              />
            </div>
            <div className={localStyle["form-group"]}>
              <label htmlFor="base_salary">Base Salary *</label>
              <input
                type="number"
                id="base_salary"
                name="base_salary"
                step="0.01"
                required
                value={formData.base_salary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    base_salary: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={localStyle["form-group"]}>
              <label htmlFor="tax_rate">Tax Rate (%) *</label>
              <input
                type="number"
                id="tax_rate"
                name="tax_rate"
                min="0"
                max="100"
                value={formData.tax_rate}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax_rate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={localStyle["form-group"]}>
              <label htmlFor="sss_contribution">SSS Contribution</label>
              <input
                type="number"
                id="sss_contribution"
                name="sss_contribution"
                step="0.01"
                value={formData.sss_contribution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sss_contribution: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={localStyle["form-group"]}>
              <label htmlFor="philhealth_contribution">
                PhilHealth Contribution
              </label>
              <input
                type="number"
                id="philhealth_contribution"
                name="philhealth_contribution"
                step="0.01"
                value={formData.philhealth_contribution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    philhealth_contribution: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={localStyle["form-group"]}>
              <label htmlFor="pagibig_contribution">
                Pag-IBIG Contribution
              </label>
              <input
                type="number"
                id="pagibig_contribution"
                name="pagibig_contribution"
                step="0.01"
                value={formData.pagibig_contribution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pagibig_contribution: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className={localStyle["form-actions"]}>
              <button
                type="submit"
                className={localStyle["submit-button"]}
                onClick={handleSubmit}
              >
                <i className="fas fa-plus-circle"></i> Create Structure
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default SalaryStructures;
