import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./EmployeePage/UserContext";

//Login
import LoginPage from "./LoginPage/LoginPage";

//Admin
import AdminPage from "./AdminPage/AdminPage";
import AdminEmployee from "./AdminPage/Employees";
import SalaryStructures from "./AdminPage/SalaryStructures";
import AdminPayroll from "./AdminPage/Payroll";
import AdminUsers from "./AdminPage/Admin";
import PayrollDetails from "./AdminPage/PayrollDetails";
import EmployeeEdit from "./AdminPage/EmployeeEdit";
import SalaryEdit from "./AdminPage/SalaryEdit";
import GroupMember from "./AdminPage/GroupMember";

//Employee
import EmployeePage from "./EmployeePage/EmployeePage";
import PayrollHistory from "./EmployeePage/PayrollHistory";
import PersonalInfo from "./EmployeePage/PersonalInfo";
import Payslip from "./EmployeePage/Payslip";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          // Login
          <Route path="/" element={<LoginPage />} />
          // Admin
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/employees" element={<AdminEmployee />} />
          <Route path="/admin/salary" element={<SalaryStructures />} />
          <Route path="/admin/payroll" element={<AdminPayroll />} />
          <Route path="/admin/payroll/details" element={<PayrollDetails />} />
          <Route path="/admin/admins" element={<AdminUsers />} />
          <Route path="/admin/employees/edit" element={<EmployeeEdit />} />
          <Route path="/admin/salary/edit" element={<SalaryEdit />} />
          <Route path="/admin/group" element={<GroupMember />} />
          // Employee
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/employee/info" element={<PersonalInfo />} />
          <Route path="/employee/payroll" element={<PayrollHistory />} />
          <Route path="/payroll/payslip" element={<Payslip />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
