import React, { useState, useEffect } from "react";
import styles from "./Employee.module.css";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

function Payslip() {
  const { user } = useContext(UserContext);
  const { state: payrolls } = useLocation();
  const now = new Date();

  const [salaryStructure, setSalaryStructure] = useState({
    salary_structure_id: 0,
    base_salary: "default",
    tax_rate: "default",
    sss_contribution: "default",
    philhealth_contribution: "default",
    pagibig_contribution: "default",
  });

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

  //    working old get deductions
  useEffect(() => {
    if (payrolls.payroll_id) {
      axios
        .post("http://localhost:3000/employee/get_deductions", {
          payroll_id: payrolls.payroll_id,
        })
        .then((res) => {
          setDeductions(res.data.result);
        })
        .catch((err) => console.error("Failed to fetch deduction data:", err));
    }
  }, []);

  //   working old get bonuses
  useEffect(() => {
    axios
      .post("http://localhost:3000/employee/get_bonuses", {
        payroll_id: payrolls.payroll_id,
      })
      .then((res) => {
        setBonus(res.data.result);
      })
      .catch((err) => console.error("Failed to fetch bonus data:", err));
  }, []);

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
              <Link to="/employee/payroll" className={styles.active}>
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
          <div className={styles["payslip-container"]}>
            <header className={styles["payslip-header"]}>
              <div className={styles["company-info"]}>
                <h2 className={styles["company-name"]}>Your Company Name</h2>
                <p className={styles["company-address"]}>
                  123 Main Street, Anytown, Philippines
                </p>
              </div>
              <div className={styles["payslip-id"]}>
                <p>
                  <span className={styles["label"]}>Payslip No:</span>{" "}
                  <span className={styles["value"]}>{payrolls.payroll_id}</span>
                </p>
                <p>
                  <span className={styles["label"]}>Date:</span>{" "}
                  <span className={styles["value"]}>
                    {now.toDateString().slice(3, 15)}
                  </span>
                </p>
              </div>
            </header>

            <section className={styles["employee-info"]}>
              <h3>Employee Information</h3>
              <p>
                <span className={styles["label"]}>Employee ID:</span>{" "}
                <span className={styles["value"]}>{user.id}</span>
              </p>
              <p>
                <span className={styles["label"]}>Name:</span>{" "}
                <span className={styles["value"]}>{user.name}</span>
              </p>
              <p>
                <span className={styles["label"]}>Position:</span>{" "}
                <span className={styles["value"]}>{user.position}</span>
              </p>
              <p>
                <span className={styles["label"]}>Hire Date:</span>{" "}
                <span className={styles["value"]}>
                  {new Date(user.hire_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </section>

            <section className={styles["payroll-period"]}>
              <h3>Payroll Period</h3>
              <p>
                <span className={styles["label"]}>Pay Period:</span>{" "}
                <span className={styles["value"]}>
                  {new Date(payrolls.pay_period_start).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                  -{" "}
                  {new Date(payrolls.pay_period_end).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </p>
            </section>

            <section className={styles["earnings"]}>
              <h3>Earnings</h3>
              <div className={styles["earnings-table"]}>
                <div className={styles["table-row"] + " " + styles["header"]}>
                  <div className={styles["description"]}>Description</div>
                  <div className={styles["amount"]}>Amount</div>
                </div>
                <div className={styles["table-row"]}>
                  <div className={styles["description"]}>Gross Salary</div>
                  <div className={styles["amount"]}>
                    ₱ {payrolls.gross_salary}
                  </div>
                </div>
                {bonus.map((bonuses) => {
                  return (
                    <div className={styles["table-row"]} key={bonuses.bonus_id}>
                      <div className={styles["description"]}>
                        {bonuses.description.toLocaleString()}
                      </div>
                      <div className={styles.amount}>
                        ₱ {bonuses.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}

                <div className={styles["table-row"] + " " + styles["header"]}>
                  <div className={styles["description"]}>Total Earnings</div>
                  <div className={styles["amount"]}>
                    ₱{" "}
                    {(
                      parseFloat(payrolls.net_salary) +
                      parseFloat(payrolls.total_deductions)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </section>

            <section className={styles["deductions"]}>
              <h3>Deductions</h3>
              <div className={styles["deductions-table"]}>
                <div className={styles["table-row"] + " " + styles["header"]}>
                  <div className={styles["description"]}>Description</div>
                  <div className={styles["amount"]}>Amount</div>
                </div>
                <div className={styles["table-row"]}>
                  <div className={styles["description"]}>SSS Contribution</div>
                  <div className={styles["amount"]}>
                    ₱ {salaryStructure.sss_contribution}
                  </div>
                </div>
                <div className={styles["table-row"]}>
                  <div className={styles["description"]}>
                    PhilHealth Contribution
                  </div>
                  <div className={styles["amount"]}>
                    ₱ {salaryStructure.philhealth_contribution}
                  </div>
                </div>
                <div className={styles["table-row"]}>
                  <div className={styles["description"]}>
                    Pag-IBIG Contribution
                  </div>
                  <div className={styles["amount"]}>
                    ₱ {salaryStructure.pagibig_contribution}
                  </div>
                </div>
                {deductions.map((deduction) => {
                  return (
                    <div
                      className={styles["table-row"]}
                      key={deduction.deduction_id}
                    >
                      <div className={styles["description"]}>
                        {deduction.description}
                      </div>
                      <div className={styles["amount"]}>
                        ₱ {deduction.amount}
                      </div>
                    </div>
                  );
                })}

                <div className={styles["table-row"] + " " + styles["total"]}>
                  <div className={styles["description"]}>Total Deductions</div>
                  <div className={styles["amount"]}>
                    ₱{" "}
                    {(
                      Number(salaryStructure.sss_contribution) +
                      Number(salaryStructure.pagibig_contribution) +
                      Number(salaryStructure.philhealth_contribution) +
                      deductions.reduce(
                        (sum, d) => sum + Number(d.amount || 0),
                        0
                      )
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </section>

            <section className={styles["totals"]}>
              <h3>Net Pay</h3>
              <p className={styles["net-pay"]}>
                <span className={styles["label"]}>Net Salary:</span>{" "}
                <span className={styles["amount"]}>₱ 26,000.00</span>
              </p>
            </section>

            <section className={styles["description-note"]}>
              <p>
                This payslip reflects payment for the first half of April 2025.
                For any inquiries, please contact the HR department.
              </p>
            </section>

            <footer className={styles["payslip-footer"]}>
              <p>
                This is a system-generated payslip and does not require a
                signature.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Payslip;
