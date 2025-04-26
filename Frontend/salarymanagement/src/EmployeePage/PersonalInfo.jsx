import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Employee.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function PersonalInfo() {
  const { user } = useContext(UserContext);
  const [salaryStructure, setSalaryStructure] = useState({
    salary_structure_id: 0,
    base_salary: "default",
    tax_rate: "default",
    sss_contribution: "default",
    philhealth_contribution: "default",
    pagibig_contribution: "default",
  });

  const [payroll, setPayroll] = useState([]);
  const [deductions, setDeductions] = useState([
    {
      deduction_id: 1,
      payroll_id: 1,
      description: "1",
      amount: "1",
      deduction_date: "2025-01-01",
    },
  ]);

  const [bonus, setBonus] = useState([
    {
      bonus_id: 1,
      payroll_id: 1,
      description: "1",
      amount: "1",
      bonus_date: "2025-01-01",
    },
  ]);

  // working
  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_salary_structure", {
        user,
      })
      .then((res) => {
        const data = res.data.result[0];
        console.log("Fetched data:", data);
        setSalaryStructure(data);
      })
      .catch((err) =>
        console.error("Failed to fetch salary structure data:", err)
      );
  }, []);

  // working old get payroll
  // useEffect(() => {
  //   axios
  //     .post("http://localhost:3000/employee/get_payroll", {
  //       id: user.id,
  //     })
  //     .then((res) => {
  //       const data = res.data.result[0];
  //       setPayroll(data);
  //     })
  //     .catch((err) => console.error("Failed to fetch payroll data:", err));
  // }, []);

  // working old get deductions
  // useEffect(() => {
  //   if (payroll.payroll_id) {
  //     axios
  //       .post("http://localhost:3000/employee/get_deductions", {
  //         payroll_id: payroll.payroll_id,
  //       })
  //       .then((res) => {
  //         setDeductions(res.data.result);
  //       })
  //       .catch((err) => console.error("Failed to fetch deduction data:", err));
  //   }
  // }, [payroll]);

  // working old get bonuses
  // useEffect(() => {
  //   if (payroll.payroll_id) {
  //     axios
  //       .post("http://localhost:3000/employee/get_bonuses", {
  //         payroll_id: payroll.payroll_id,
  //       })
  //       .then((res) => {
  //         setBonus(res.data.result);
  //       })
  //       .catch((err) => console.error("Failed to fetch bonus data:", err));
  //   }
  // }, [payroll]);

  // checker
  // useEffect(() => {
  //   console.log("Updated salary structure:", salaryStructure);
  // }, [salaryStructure]);

  // payroll
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

  // get deduction
  useEffect(() => {
    const fetchDeductions = async () => {
      const allDeductions = [];

      for (const p of payroll) {
        try {
          const res = await axios.post(
            "http://localhost:3000/employee/get_deductions",
            {
              payroll_id: p.payroll_id,
            }
          );
          allDeductions.push(...res.data.result);
        } catch (err) {
          console.error(
            "Failed to fetch deduction data for payroll ID",
            p.payroll_id,
            err
          );
        }
      }

      setDeductions(allDeductions);
    };

    if (payroll.length > 0) {
      fetchDeductions();
    }
  }, [payroll]);

  // get bonuses
  useEffect(() => {
    const fetchBonuses = async () => {
      const allBonuses = [];

      for (const p of payroll) {
        try {
          const res = await axios.post(
            "http://localhost:3000/employee/get_bonuses",
            {
              payroll_id: p.payroll_id,
            }
          );
          allBonuses.push(...res.data.result);
        } catch (err) {
          console.error(
            "Failed to fetch bonus data for payroll ID",
            p.payroll_id,
            err
          );
        }
      }

      setBonus(allBonuses);
    };

    if (payroll.length > 0) {
      fetchBonuses();
    }
  }, [payroll]);

  useEffect(() => {
    console.log("Updated payroll structure:", payroll);
  }, [payroll]);

  useEffect(() => {
    console.log("Updated bonus", bonus);
  }, [bonus]);

  useEffect(() => {
    console.log("Updated deduction structure:", deductions);
  }, [deductions]);

  const formatDateForInput = (isoDate) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <div>
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
          <h1>Personal Information</h1>

          <section className={styles["description-section"]}>
            <p>
              <i className="fas fa-exclamation-circle"></i> View your personal
              details below. Please note that these details cannot be edited
              through this portal for security reasons. If any information is
              incorrect, please contact the Administrator.
            </p>
          </section>

          <section className={styles["personal-info-section"]}>
            <h3>Employee Details</h3>
            <div className={styles["info-grid"]}>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>First Name:</span>
                <span className={styles["value"]}>{user.first_name}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Position:</span>
                <span className={styles["value"]}>{user.position}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Last Name:</span>
                <span className={styles["value"]}>{user.last_name}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Hire Date:</span>
                <span className={styles["value"]}>
                  {formatDateForInput(user.hire_date)}
                </span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Username:</span>
                <span className={styles["value"]}>{user.username}</span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Salary Structure ID:</span>
                <span className={styles["value"]}>
                  {user.salary_structure_id}
                </span>
              </div>
            </div>
          </section>

          <section className={styles["salary-structure-section"]}>
            <h3>Salary Structure</h3>
            <div className={styles["info-grid"]}>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Base Salary:</span>
                <span className={styles["value"]}>
                  ₱ {salaryStructure.base_salary.toLocaleString()}
                </span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Tax Rate:</span>
                <span className={styles["value"]}>
                  ₱ {salaryStructure.tax_rate.toLocaleString()}%
                </span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>SSS Contribution:</span>
                <span className={styles["value"]}>
                  ₱ {salaryStructure.sss_contribution}
                </span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>
                  PhilHealth Contribution:
                </span>
                <span className={styles["value"]}>
                  ₱ {salaryStructure.philhealth_contribution}
                </span>
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["label"]}>Pag-IBIG Contribution:</span>
                <span className={styles["value"]}>
                  ₱ {salaryStructure.pagibig_contribution}
                </span>
              </div>
            </div>
          </section>

          <section className={styles["bonuses-received-section"]}>
            <h3>Bonuses Received</h3>
            <div className={styles["info-grid"]}>
              {bonus && bonus.length > 0 ? (
                bonus.map((bonuses) => (
                  <div className={styles["info-item"]} key={bonuses.bonus_id}>
                    <span className={styles["label"]}>
                      {bonuses.description}:
                    </span>
                    <span className={styles["value"]}>
                      ₱ {bonuses.amount} ({bonuses.bonus_date.slice(0, 10)})
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles["no-data"]}>No bonuses recorded yet.</p>
              )}
            </div>
          </section>

          <section className={styles["deductions-received-section"]}>
            <h3>Deductions Received</h3>
            <div className={styles["info-grid"]}>
              {deductions && deductions.length > 0 ? (
                deductions.map((deduction) => (
                  <div
                    className={styles["info-item"]}
                    key={deduction.deduction_id}
                  >
                    <span className={styles["label"]}>
                      {deduction.description}:
                    </span>
                    <span className={styles["value"]}>
                      ₱ {deduction.amount} (
                      {deduction.deduction_date.slice(0, 10)})
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles["no-data"]}>No deductions recorded yet.</p>
              )}
            </div>
          </section>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default PersonalInfo;
