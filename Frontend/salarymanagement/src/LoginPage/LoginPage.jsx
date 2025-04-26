import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./LoginPage.module.css";
import { useContext } from "react";
import { UserContext } from "../EmployeePage/UserContext.jsx";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/authenticate", {
        username,
        password,
      });
      if (response.data.success) {
        const { access_level } = response.data.user;
        const user = response.data.user;
        setUser(user);
        if (access_level === "admin") {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className={style.center}>
      <h1>Login</h1>

      <div className={style.first}>
        <h3>Salary Management System</h3>
      </div>

      <form method="post">
        <div className={style["txt-feild"]}>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span></span>
          <label>Username</label>
        </div>

        <div className={style["txt-feild"]}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span></span>
          <label>Password</label>
        </div>

        <div className={style.pass}>Forgot Password?</div>

        <input
          type="submit"
          value="Login"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        />
      </form>
    </div>
  );
}

export default LoginPage;
