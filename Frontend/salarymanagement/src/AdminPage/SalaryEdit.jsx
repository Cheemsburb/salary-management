import React, { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";
import { Link, useLocation } from "react-router-dom"; // Import Link (Recommended)
import axios from "axios";
import localStyle from "./SalaryStructures.module.css";

function SalaryEdit() {
  const { state } = useLocation();
  const salaryStructure = state;

  const [formData, setFormData] = useState({
    salary_structure_id: salaryStructure.salary_structure_id,
    structure_name: salaryStructure.structure_name,
    base_salary: salaryStructure.base_salary,
    tax_rate: salaryStructure.tax_rate,
    sss_contribution: salaryStructure.sss_contribution,
    philhealth_contribution: salaryStructure.philhealth_contribution,
    pagibig_contribution: salaryStructure.pagibig_contribution,
  });

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (
        formData[key] === null ||
        formData[key] === "" ||
        (isNaN(formData[key]) && key !== "structure_name")
      ) {
        alert(`${key.replace("_", " ")} cannot be empty or null.`);
        return;
      }
    }

    const confirmUpdate = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!confirmUpdate) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/update_salary",
        {
          ...formData,
          salary_structure_id: salaryStructure.salary_structure_id,
        }
      );

      if (response.data.success) {
        alert("Salaryupdated successfully!");
      } else {
        alert("Failed to update employee. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the salary.");
    }
  };
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
              <Link to="">
                <i className="fas fa-sign-out-alt"></i> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles["content"]}>
        <header>
          <h1>
            <i className="fas fa-edit"></i> Edit Salary Structure
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>Edit Salary Structure Details</h2>
          <p>
            This section allows you to modify the details of the selected salary
            structure.
          </p>
        </section>

        <section className={styles["edit-salary-structure-form"]}>
          <h2>Edit Salary Structure</h2>
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
                required
                value={formData.tax_rate}
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
                onClick={handleSaveChanges}
              >
                <i className="fas fa-plus-circle"></i> Save Changes
              </button>
              <Link
                to={"/admin/salary"}
                className={`${localStyle["action-button"]} ${localStyle["secondaryButton"]}`}
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

export default SalaryEdit;
