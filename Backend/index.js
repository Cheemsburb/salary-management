const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: process.env.database,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", db.threadId);
});

app.use(express.json());
app.use(cors());

// get all employees
app.get("/employees", (req, res) => {
  const query = "SELECT * from Employees WHERE access_level != 'admin';";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// get all admins
app.get("/admin", (req, res) => {
  const query = "SELECT * FROM employees WHERE access_level = 'admin'";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// login
app.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM employees WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: {
          id: user.employee_id,
          name: user.first_name + " " + user.last_name,
          access_level: user.access_level,
          first_name: user.first_name,
          last_name: user.last_name,
          position: user.position,
          hire_date: user.hire_date,
          salary_structure_id: user.salary_structure_id,
          password: user.password,
          username: user.username,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  });
});

// add employee
app.post("/admin/add_employee", (req, res) => {
  const {
    first_name,
    last_name,
    position,
    hire_date,
    salary_structure_id,
    password,
    access_level,
    username,
  } = req.body;

  const query =
    "INSERT INTO Employees (first_name, last_name, position, hire_date, salary_structure_id, password, access_level, username) VALUES (?,?,?,?,?,?,?,?);";

  db.query(
    query,
    [
      first_name,
      last_name,
      position,
      hire_date,
      salary_structure_id,
      password,
      access_level,
      username,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Employee added successfully" });
      }
    }
  );
});

// all info displayed on dashboard
app.get("/admin/dashboard", (req, res) => {
  const query = `
  SELECT 
    (SELECT COUNT(*) FROM Employees WHERE access_level != 'admin') AS total_employees,
    (SELECT MAX(p.net_salary)
     FROM Payroll p
     JOIN Employees e ON p.employee_id = e.employee_id
     WHERE e.access_level != 'admin') AS highest_net_salary,
    (SELECT AVG(p.net_salary)
     FROM Payroll p
     JOIN Employees e ON p.employee_id = e.employee_id
     WHERE e.access_level != 'admin') AS average_net_salary;
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// deleting employee
app.post("/admin/delete_employee", (req, res) => {
  const { employee_id } = req.body;
  const deleteEmployeeQuery = "DELETE FROM Employees WHERE employee_id = ?";

  db.query(deleteEmployeeQuery, [employee_id], (err) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ message: "Employee delete error" });
    }

    return res.status(200).json({ message: "Employee deleted" });
  });
});

// get all salary structure
app.get("/admin/salary_structures", (req, res) => {
  const query = "SELECT * FROM Salary_Structures;";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// add new salary structure
app.post("/admin/add_salary_structure", (req, res) => {
  const {
    structure_name,
    base_salary,
    tax_rate,
    sss_contribution,
    philhealth_contribution,
    pagibig_contribution,
  } = req.body;

  const query =
    "INSERT INTO Salary_Structures (structure_name, base_salary, tax_rate, sss_contribution, philhealth_contribution, pagibig_contribution) VALUES (?, ?, ?, ?, ?, ?);";

  db.query(
    query,
    [
      structure_name,
      base_salary,
      tax_rate,
      sss_contribution,
      philhealth_contribution,
      pagibig_contribution,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Salary added successfully" });
      }
    }
  );
});

// DELETE salary‑structure
app.post("/admin/delete_salary_structure", (req, res) => {
  const { salary_structure_id } = req.body;

  if (!salary_structure_id) {
    return res.status(400).json({ message: "salary_structure_id is required" });
  }

  const deleteQuery =
    "DELETE FROM Salary_Structures WHERE salary_structure_id = ?";

  db.query(deleteQuery, [salary_structure_id], (err, result) => {
    if (err) {
      if (err.errno === 1451) {
        return res.status(409).json({
          message:
            "Cannot delete this salary structure because it is still assigned to one or more employees. " +
            "Reassign those employees to a different structure first.",
        });
      }

      console.error("Delete salary structure failed:", err);
      return res
        .status(500)
        .json({ message: "Database error while deleting structure" });
    }

    // If nothing was deleted, the ID doesn’t exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Salary structure not found" });
    }

    return res
      .status(200)
      .json({ message: "Salary structure deleted successfully" });
  });
});

// get payroll of all employee general
app.get("/admin/all_payroll", (req, res) => {
  const query = "SELECT * FROM Payroll WHERE employee_id != 1;";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// craeting processing payroll
app.post("/admin/create_payroll", (req, res) => {
  const { employee_id, pay_period_start, pay_period_end } = req.body;

  const query =
    "INSERT INTO Payroll (employee_id, pay_period_start, pay_period_end, gross_salary, total_deductions, total_bonuses, net_salary, status) VALUES (?, ?, ?, 0, 0, 0, 0, 'processing' );";

  db.query(query, [employee_id, pay_period_start, pay_period_end], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Please make sure that pay period start < pay period end",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "payroll created successfully",
      });
    }
  });
});

// get specific employees
app.post("/admin/employee", (req, res) => {
  const { employee_id } = req.body;
  const query =
    "SELECT * from Employees WHERE access_level != 'admin' AND employee_id = ?;";

  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.status(200).json(results);
  });
});

// getting all employee's info in salary structure spcicif
app.post("/employee/get_salary_structure", (req, res) => {
  const { user } = req.body;

  const query =
    "SELECT * FROM Salary_Structures WHERE salary_structure_id = ?;";

  db.query(query, [user.salary_structure_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Salary retrieved successfully",
        result: results,
      });
    }
  });
});

// gets all employee's info on deductions specific
app.post("/employee/get_deductions", (req, res) => {
  const { payroll_id } = req.body;

  const query = "SELECT * FROM Deductions WHERE payroll_id = ?;";

  db.query(query, [payroll_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Deduction retrieve successfully",
        result: results,
      });
    }
  });
});

// gets all employee's info on bonus specific
app.post("/employee/get_bonuses", (req, res) => {
  const { payroll_id } = req.body;

  const query = "SELECT * FROM Bonuses WHERE payroll_id = ?;";

  db.query(query, [payroll_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Bonus retrieve successfully",
        result: results,
      });
    }
  });
});

// gets all employee's info on payroll specific
app.post("/employee/get_payroll", (req, res) => {
  const { id } = req.body;

  const query =
    "SELECT * FROM Payroll WHERE employee_id = ? AND status = 'paid';";

  db.query(query, id, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Payroll retrieved successfully",
        result: results,
      });
    }
  });
});

// add deductions on specific payroll
app.post("/admin/add_deduction", (req, res) => {
  const { payroll_id, description, amount, deduction_date } = req.body;

  const query =
    "INSERT INTO Deductions (payroll_id, description, amount, deduction_date) VALUES (?, ?, ?, ?);";

  db.query(
    query,
    [payroll_id, description, amount, deduction_date],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Deduction added successfully",
          result: results,
        });
      }
    }
  );
});

// add bonus on specific payroll
app.post("/admin/add_bonus", (req, res) => {
  const { payroll_id, description, amount, bonus_date } = req.body;

  const query =
    "INSERT INTO Bonuses (payroll_id, description, amount, bonus_date) VALUES (?, ?, ?, ?);";

  db.query(
    query,
    [payroll_id, description, amount, bonus_date],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Bonus added successfully",
          result: results,
        });
      }
    }
  );
});

// delete deductions
app.post("/admin/delete_deduction", (req, res) => {
  const { deduction_id } = req.body;

  const query = "DELETE FROM Deductions WHERE deduction_id = ?;";

  db.query(query, [deduction_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Deduction deleted successfully",
        result: results,
      });
    }
  });
});

// delete bonuses
app.post("/admin/delete_bonus", (req, res) => {
  const { bonus_id } = req.body;

  const query = "DELETE FROM Bonuses WHERE bonus_id = ?;";

  db.query(query, [bonus_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Bonus deleted successfully",
        result: results,
      });
    }
  });
});

// mark as paid the payroll
app.post("/admin/payroll_paid", (req, res) => {
  const { payroll_id, base, totalDeduction, totalBonus, netSalary } = req.body;

  const query = `
  UPDATE Payroll
  SET   gross_salary     = ?,
        total_deductions = ?,
        total_bonuses    = ?,
        net_salary       = ?,
        status           = 'paid'
  WHERE payroll_id = ?;
  `;

  db.query(
    query,
    [base, totalDeduction, totalBonus, netSalary, payroll_id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Payroll Updated successfully",
          result: results,
        });
      }
    }
  );
});

//delete payroll
app.post("/admin/delete_payroll", (req, res) => {
  const { payroll_id } = req.body;

  const query = "DELETE FROM Payroll WHERE payroll_id = ?;";

  db.query(query, [payroll_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Payroll Deleted successfully",
        result: results,
      });
    }
  });
});

// update employee / edit employee
app.post("/admin/update_employee", (req, res) => {
  const {
    first_name,
    last_name,
    position,
    hire_date,
    salary_structure_id,
    password,
    access_level,
    username,
    employee_id,
  } = req.body;

  const query = `UPDATE Employees
  SET 
  first_name = ?,
	last_name = ?,
  position = ?,
  hire_date = ?,
  salary_structure_id = ?,
  password = ?,
  access_level = ?,
  username = ?
  WHERE employee_id = ?;`;

  db.query(
    query,
    [
      first_name,
      last_name,
      position,
      hire_date,
      salary_structure_id,
      password,
      access_level,
      username,
      employee_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Employee Updated successfully",
          result: results,
        });
      }
    }
  );
});

// update salary / edit salary
app.post("/admin/update_salary", (req, res) => {
  const {
    salary_structure_id,
    structure_name,
    base_salary,
    tax_rate,
    sss_contribution,
    philhealth_contribution,
    pagibig_contribution,
  } = req.body;

  const query = `UPDATE Salary_Structures
  SET 
  structure_name = ?,
  base_salary = ?,
  tax_rate = ?,
  sss_contribution = ?,
  philhealth_contribution = ?,
  pagibig_contribution = ?
  WHERE salary_structure_id = ?;`;

  db.query(
    query,
    [
      structure_name,
      base_salary,
      tax_rate,
      sss_contribution,
      philhealth_contribution,
      pagibig_contribution,
      salary_structure_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Salary Updated successfully",
          result: results,
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
