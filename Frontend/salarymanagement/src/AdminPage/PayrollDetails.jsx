import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AdminPage.module.css";
import { useLocation } from "react-router-dom";

function PayrollDetails() {
  const { state } = useLocation();
  const payroll = state;
  const [salaryStructure, setSalaryStructure] = useState({
    salary_structure_id: 0,
    base_salary: 0,
    tax_rate: 0,
    sss_contribution: 0,
    philhealth_contribution: 0,
    pagibig_contribution: 0,
  });

  const [deductions, setDeductions] = useState([
    {
      deduction_id: 0,
      payroll_id: 0,
      description: "1",
      amount: 0,
      deduction_date: "2025-01-01",
    },
  ]);

  const [bonus, setBonus] = useState([
    {
      bonus_id: 0,
      payroll_id: 0,
      description: "1",
      amount: 0,
      bonus_date: "2025-01-01",
    },
  ]);

  const [deductionAmount, setDeductionAmount] = useState({
    deduction_id: 0,
    payroll_id: 0,
    description: "1",
    amount: 0,
    deduction_date: "2025-01-01",
  });

  const [bonusAmount, setBonusAmount] = useState({
    deduction_id: 0,
    payroll_id: 0,
    description: "1",
    amount: 0,
    deduction_date: "2025-01-01",
  });

  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios
      .post("http://localhost:3000/admin/employee", {
        employee_id: payroll.employee_id,
      })
      .then((res) => {
        const data = res.data[0];
        console.log("data");

        console.log(data);

        setEmployee(data);
      })
      .catch((err) => console.error("Failed to fetch employee data:", err));
  }, []);

  useEffect(() => {
    if (!employee.salary_structure_id) return;

    axios
      .post("http://localhost:3000/employee/get_salary_structure", {
        user: { salary_structure_id: employee.salary_structure_id },
      })
      .then((res) => {
        const data = res.data.result ? res.data.result[0] : res.data[0];
        setSalaryStructure(data);
      })
      .catch((err) =>
        console.error("Failed to fetch salary structure data:", err)
      );
  }, [employee.salary_structure_id]);

  useEffect(() => {
    console.log(salaryStructure);
  }, [salaryStructure]);

  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_deductions", {
        payroll_id: payroll.payroll_id,
      })
      .then((res) => {
        setDeductions(res.data.result);
      })
      .catch((err) => console.error("Failed to fetch deduction data:", err));
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_bonuses", {
        payroll_id: payroll.payroll_id,
      })
      .then((res) => {
        setBonus(res.data.result);
      })
      .catch((err) => console.error("Failed to fetch bonus data:", err));
    console.log("pay start" + payroll.pay_period_end);
    console.log("pay end" + payroll.pay_period_start);
  }, []);

  const handleAddDeduction = async (e) => {
    e.preventDefault();

    const form = e.target.closest("form");
    const description = form.deduction_description.value.trim();
    const amount = deductionAmount.amount;
    const deduction_date = form.deduction_date.value;

    if (!description || !amount || !deduction_date)
      return alert("Please fill‑in every field.");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/add_deduction",
        {
          payroll_id: payroll.payroll_id,
          description,
          amount,
          deduction_date,
        }
      );

      if (data.success) {
        setDeductions((prev) => [
          ...prev,
          {
            deduction_id: data.result.insertId,
            payroll_id: payroll.payroll_id,
            description,
            amount,
            deduction_date,
          },
        ]);

        form.reset();
      }
    } catch (err) {
      console.error("Failed to add deduction:", err);
      alert("Server problem while saving the deduction.");
    }
  };

  const handleAddBonus = async (e) => {
    e.preventDefault();

    const form = e.target.closest("form");
    const description = form.bonus_description.value.trim();
    const amount = bonusAmount.amount;
    const bonus_date = form.bonus_date.value;

    if (!description || !amount || !bonus_date)
      return alert("Please fill‑in every field.");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/add_bonus",
        {
          payroll_id: payroll.payroll_id,
          description,
          amount,
          bonus_date,
        }
      );

      if (data.success) {
        setBonus((prev) => [
          ...prev,
          {
            bonus_id: data.result.insertId,
            payroll_id: payroll.payroll_id,
            description,
            amount,
            bonus_date,
          },
        ]);

        form.reset();
      }
    } catch (err) {
      console.error("Failed to add bonus:", err);
      alert("Server problem while saving the bonus.");
    }
  };

  const handleDeleteBonus = async (bonus_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this bonus? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/delete_bonus",
        { bonus_id }
      );

      if (data.success) {
        setBonus((prev) => prev.filter((b) => b.bonus_id !== bonus_id));
        alert("Bonus deleted successfully.");
      } else {
        alert("The server could not delete the bonus. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete bonus:", err);
      alert("Server problem while deleting the bonus.");
    }
  };

  const handleDeleteDeduction = async (deduction_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this deduction? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/delete_deduction",
        { deduction_id }
      );

      if (data.success) {
        setDeductions((prev) =>
          prev.filter((d) => d.deduction_id !== deduction_id)
        );
        alert("Deduction deleted successfully.");
      } else {
        alert("The server could not delete the deduction. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete deduction:", err);
      alert("Server problem while deleting the deduction.");
    }
  };

  const handleMarkAsPaid = async () => {
    const base = Number(salaryStructure.base_salary);
    const tax = base / Number(salaryStructure.tax_rate);
    const mandatory =
      Number(salaryStructure.sss_contribution) +
      Number(salaryStructure.philhealth_contribution) +
      Number(salaryStructure.pagibig_contribution) +
      tax;

    const totalDeduction =
      mandatory + deductions.reduce((s, d) => s + Number(d.amount), 0);
    const totalBonus = bonus.reduce((s, b) => s + Number(b.amount), 0);
    const netSalary = base + totalBonus - totalDeduction;

    const ok = window.confirm(
      `Mark this payroll as PAID?\n\n` +
        `Base Salary:        ₱ ${base.toLocaleString()}\n` +
        `Total Bonuses:      ₱ ${totalBonus.toLocaleString()}\n` +
        `Total Deductions:   ₱ ${totalDeduction.toLocaleString()}\n` +
        `———————————————\n` +
        `Net Salary:         ₱ ${netSalary.toLocaleString()}\n`
    );
    if (!ok) return;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/admin/payroll_paid",
        {
          payroll_id: payroll.payroll_id,
          base,
          totalDeduction,
          totalBonus,
          netSalary,
        }
      );

      if (data.success) {
        alert("✔ Payroll marked as paid!");

        payroll.status = "paid";
        payroll.net_salary = netSalary;

        setBonus([...bonus]);
      } else {
        alert("The server could not update the payroll. Please try again.");
      }
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      alert("Server problem while updating the payroll.");
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
              <Link to="/admin/payroll" className={styles.active}>
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
            <i className="fas fa-file-invoice-dollar"></i> Payroll Details
          </h1>
          <div className={styles["user-info"]}>Welcome, Admin User</div>
        </header>

        <section className={styles["page-description"]}>
          <h2>View and Manage Payroll Details</h2>
          <p>
            This section displays the detailed breakdown of a specific payroll
            record and allows management of deductions and bonuses.
          </p>
        </section>

        <section className={styles["payroll-details"]}>
          <h2>
            Payroll Details - [ID: {payroll.payroll_id}] - [
            {employee.first_name + " " + employee.last_name}]
          </h2>
          <div className={styles["detail-breakdown"]}>
            <h3>Earnings</h3>
            <ul className={styles["earnings-list"]}>
              <li>
                Base Salary:{" "}
                <span className={styles["amount"]}>
                  ₱ {salaryStructure.base_salary}
                </span>
              </li>
              {bonus.map((bonuses) => {
                return (
                  <li key={bonuses.bonus_id}>
                    {bonuses.description}:{" "}
                    <span className={styles["amount"]}>
                      {" "}
                      ₱ {bonuses.amount}
                    </span>
                    <button
                      className={styles["x-btn"]}
                      type="button"
                      onClick={() => {
                        handleDeleteBonus(bonuses.bonus_id);
                      }}
                    ></button>
                  </li>
                );
              })}
            </ul>

            <h3>Deductions</h3>
            <ul className={styles["deductions-list"]}>
              <li>
                SSS Contribution:{" "}
                <span className={styles["amount"]}>
                  ₱ {salaryStructure.sss_contribution}
                </span>
              </li>
              <li>
                PhilHealth Contribution:{" "}
                <span className={styles["amount"]}>
                  ₱ {salaryStructure.philhealth_contribution}
                </span>
              </li>
              <li>
                Pag-IBIG Contribution:{" "}
                <span className={styles["amount"]}>
                  ₱ {salaryStructure.pagibig_contribution}
                </span>
              </li>
              <li>
                Income Tax:{" "}
                <span className={styles["amount"]}>
                  ₱ {salaryStructure.base_salary / salaryStructure.tax_rate}
                </span>
              </li>
              {deductions.map((deduction) => {
                return (
                  <li key={deduction.deduction_id}>
                    {deduction.description}:{" "}
                    <span className={styles["amount"]}>
                      {" "}
                      ₱ {deduction.amount}
                    </span>
                    <button
                      className={styles["x-btn"]}
                      type="button"
                      onClick={() => {
                        handleDeleteDeduction(deduction.deduction_id);
                      }}
                    ></button>
                  </li>
                );
              })}
            </ul>

            <h3>
              Net Salary:{" "}
              <span className={styles["amount"] + " " + styles["net"]}>
                ₱ {payroll.net_salary.toLocaleString()}
              </span>
            </h3>
          </div>

          <div className={styles["manage-deductions"]}>
            <h4>Add New Deduction (Manual)</h4>
            <form className={styles["add-deduction-form"]}>
              <div className={styles["form-group"]}>
                <label htmlFor="deduction_description">Description</label>
                <input
                  type="text"
                  id="deduction_description"
                  name="deduction_description"
                  placeholder="e.g., Uniform Fee"
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="deduction_amount">Amount</label>
                <input
                  type="number"
                  id="deduction_amount"
                  name="deduction_amount"
                  step="0.01"
                  value={deductionAmount.amount}
                  onChange={(e) =>
                    setDeductionAmount((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="deduction_date">Date</label>
                <input
                  type="date"
                  id="deduction_date"
                  name="deduction_date"
                  min={
                    new Date(payroll.pay_period_start)
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(payroll.pay_period_end).toISOString().split("T")[0]
                  }
                />
              </div>
              <button
                type="submit"
                className={styles["submit-button"] + " " + styles["small"]}
                onClick={handleAddDeduction}
              >
                <i className="fas fa-plus-circle"></i> Add Deduction
              </button>
            </form>
          </div>

          <div className={styles["manage-bonuses"]}>
            <h4>Add New Bonus (Manual)</h4>
            <form className={styles["add-bonus-form"]}>
              <div className={styles["form-group"]}>
                <label htmlFor="bonus_description">Description</label>
                <input
                  type="text"
                  id="bonus_description"
                  name="bonus_description"
                  placeholder="e.g., Holiday Bonus"
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="bonus_amount">Amount</label>
                <input
                  type="number"
                  id="bonus_amount"
                  name="bonus_amount"
                  step="0.01"
                  value={bonusAmount.amount}
                  onChange={(e) =>
                    setBonusAmount((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="bonus_date">Date</label>
                <input
                  type="date"
                  id="bonus_date"
                  name="bonus_date"
                  min={
                    new Date(payroll.pay_period_start)
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(payroll.pay_period_end).toISOString().split("T")[0]
                  }
                />
              </div>
              <button
                type="submit"
                className={styles["submit-button"] + " " + styles["small"]}
                onClick={handleAddBonus}
              >
                <i className="fas fa-plus-circle"></i> Add Bonus
              </button>
            </form>
          </div>

          <div className={styles["process-payroll-actions"]}>
            <button
              className={styles["action-button"] + " " + styles["success"]}
              onClick={handleMarkAsPaid}
            >
              <i className="fas fa-check"></i> Mark as Paid
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PayrollDetails;
