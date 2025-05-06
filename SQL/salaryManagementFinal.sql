DROP DATABASE IF EXISTS salarymanagement;
CREATE DATABASE salarymanagement;

USE salarymanagement;

-- 1. Salary_Structures Table
CREATE TABLE Salary_Structures (
	salary_structure_id INT PRIMARY KEY AUTO_INCREMENT,
    structure_name VARCHAR(50) NOT NULL,
	base_salary DECIMAL(10,2) NOT NULL,
	tax_rate DECIMAL(5,2) NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 100),
	sss_contribution DECIMAL(10,2) NOT NULL,
	philhealth_contribution DECIMAL(10,2) NOT NULL,
	pagibig_contribution DECIMAL(10,2) NOT NULL
)AUTO_INCREMENT = 1;

-- 2. Employees Table
CREATE TABLE Employees (
	employee_id INT PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	position VARCHAR(50),
	hire_date DATE NOT NULL,
	salary_structure_id INT,
	password VARCHAR(255) NOT NULL,
	access_level ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
	username VARCHAR(50) NOT NULL,
	FOREIGN KEY (salary_structure_id)
        REFERENCES Salary_Structures(salary_structure_id)
        ON DELETE RESTRICT 
)AUTO_INCREMENT = 1;

-- 3. Payroll Table (with start and end date for pay period)
CREATE TABLE Payroll (
	payroll_id INT PRIMARY KEY AUTO_INCREMENT,
	employee_id INT NOT NULL,
	pay_period_start DATE NOT NULL,
	pay_period_end DATE NOT NULL,
	gross_salary DECIMAL(10,2) NOT NULL,
	total_deductions DECIMAL(10,2) NOT NULL,
	total_bonuses DECIMAL(10,2) NOT NULL,
	net_salary DECIMAL(10,2) NOT NULL,
    status ENUM('processing', 'paid') NOT NULL DEFAULT 'processing',
	FOREIGN KEY (employee_id)
        REFERENCES Employees(employee_id)
        ON DELETE CASCADE  ,
	CHECK (pay_period_end > pay_period_start)
)AUTO_INCREMENT = 1;

-- 4. Deductions Table
CREATE TABLE Deductions (
    deduction_id INT PRIMARY KEY AUTO_INCREMENT,
    payroll_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    deduction_date DATE NOT NULL,
    FOREIGN KEY (payroll_id)
        REFERENCES Payroll(payroll_id)
        ON DELETE CASCADE
)AUTO_INCREMENT = 1;

-- 5. Bonuses Table
CREATE TABLE Bonuses (
    bonus_id INT PRIMARY KEY AUTO_INCREMENT,
    payroll_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    bonus_date DATE NOT NULL,
    FOREIGN KEY (payroll_id)
        REFERENCES Payroll(payroll_id)
        ON DELETE CASCADE
)AUTO_INCREMENT = 1;

INSERT INTO Salary_Structures (structure_name, base_salary, tax_rate, sss_contribution, philhealth_contribution, pagibig_contribution) VALUES
("Mid Level", 30000.00, 10.00, 1350.00, 450.00, 200.00),
("Junior Level", 25000.00, 8.00, 1125.00, 375.00, 200.00),
("Senior Level", 40000.00, 12.00, 1800.00, 600.00, 200.00);

INSERT INTO Employees (first_name, last_name, position, hire_date, salary_structure_id, password, access_level, username) VALUES
('Admin', 'User', 'System Administrator', '2017-01-01', 3, 'adminpass123', 'admin', 'Admin'),
('Juan', 'Dela Cruz', 'Software Engineer', '2020-01-15', 1, 'juan123', 'employee', 'Juan23'),
('Maria', 'Santos', 'Accountant', '2019-03-22', 2, 'maria123', 'employee', 'Maria23'),
('Pedro', 'Reyes', 'HR Officer', '2021-06-10', 1, 'pedro123', 'employee', 'Pedro23'),
('Ana', 'Lopez', 'Manager', '2018-11-05', 3, 'ana123', 'employee', 'Ana23');

INSERT INTO Payroll (employee_id, pay_period_start, pay_period_end, gross_salary, total_deductions, total_bonuses, net_salary, status) VALUES
(1, '2025-04-01', '2025-04-15', 30000.00, 4850.00, 1000.00, 26150.00, 'paid'),
(2, '2025-04-01', '2025-04-15', 25000.00, 3125.00, 500.00, 22375.00, 'paid'),
(3, '2025-04-01', '2025-04-15', 30000.00, 4550.00, 2000.00, 27450.00, 'paid'),
(4, '2025-04-01', '2025-04-15', 40000.00, 6600.00, 3000.00, 36400.00, 'paid'),
(1, '2025-04-16', '2025-04-30', 30000.00, 5100.00, 1500.00, 26400.00, 'paid'),
(2, '2025-04-16', '2025-04-30', 25000.00, 3850.00, 0.00, 21150.00, 'paid');

INSERT INTO Deductions (payroll_id, description, amount, deduction_date) VALUES
(1, 'Late Penalty', 500.00, '2025-04-01'),
(1, 'Coffee Fee', 3000.00, '2025-04-01'),
(1, 'Missed', 1350.00, '2025-04-01'),

(2, 'Coffee Fee', 2000.00, '2025-04-01'),
(2, 'Missed', 1125.00, '2025-04-01'),

(3, 'Coffee Fee', 3200.00, '2025-04-01'),
(3, 'Missed', 1350.00, '2025-04-01'),

(4, 'Coffee Fee', 4800.00, '2025-04-01'),
(4, 'Missed', 1800.00, '2025-04-01'),

(5, 'Coffee Fee', 3000.00, '2025-04-16'),
(5, 'Missed', 1350.00, '2025-04-16'),
(5, 'Late Penalty', 500.00, '2025-04-16'),
(5, 'Health Insurance', 250.00, '2025-04-16'),

(6, 'Tax', 2100.00, '2025-04-16'),
(6, 'SSS', 1125.00, '2025-04-16'),
(6, 'Absence Deduction', 625.00, '2025-04-16');

INSERT INTO Bonuses (payroll_id, description, amount, bonus_date) VALUES
(1, 'Performance Bonus', 1000.00, '2025-04-01'),
(2, 'Referral Bonus', 500.00, '2025-04-01'),
(3, 'Incentive', 2000.00, '2025-04-01'),
(4, 'Holiday Bonus', 3000.00, '2025-04-01'),
(5, 'Quarter Bonus', 1500.00, '2025-04-16');

