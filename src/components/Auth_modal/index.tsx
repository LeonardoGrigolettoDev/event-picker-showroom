import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

// type props = {
//   props: React.ReactElement;
// };

export function AuthModal() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      console.log("Login enviado: ", email, password);
      navigate("/Event");
    } else {
      console.log("Cadastro enviado: ", email, password);

      setIsLogin(true);
    }
    navigate("/Event");
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>{isLogin ? "Login" : "Register"}</h1>
      <form className={styles.homeForm} onSubmit={handleSubmit}>
        {isLogin ? (
          <div className={styles.formSection}>
            <label className={styles.homeLabel} htmlFor="email">
              Enter your e-mail:
            </label>
            <input
              className={styles.homeInput}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
            <label className={styles.homeLabel} htmlFor="password">
              Enter your password:
            </label>
            <input
              className={styles.homeInput}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Type your password"
            />
          </div>
        ) : (
          <div className={styles.formSection}>
            <label className={styles.homeLabel} htmlFor="email">
              Email Register:
            </label>
            <input
              className={styles.homeInput}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemplo@email.com"
            />
            <label className={styles.homeLabel} htmlFor="password">
              Create Password:
            </label>
            <input
              className={styles.homeInput}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Type your password"
            />
          </div>
        )}
        <button className={styles.homeButton} type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Does not have account? Register it"
            : "Login"}
        </button>
      </form>
    </div>
  );
}
