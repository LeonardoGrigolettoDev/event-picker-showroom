import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export function AuthModal() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null); 
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLogin) {
      const saved = JSON.parse(localStorage.getItem("cadastro") || "{}");

      if (email === saved.email && password === saved.password) {
        setMessage({ text: "Login realizado com sucesso. Redirecionando...", type: "success" });
        setTimeout(() => setMessage(null), 3000); 
        navigate("/Event");
      } else {
        setMessage({ text: "E-mail ou senha inválidos.", type: "error" });
        setTimeout(() => setMessage(null), 3000); 
      }

    } else {
      localStorage.setItem("cadastro", JSON.stringify({ email, password }));
      setMessage({ text: "Cadastro realizado com sucesso. Faça login.", type: "success" });
      setTimeout(() => setMessage(null), 3000); 
      setIsLogin(true);
    }
  };

  return (
    <div className={styles.homeContainer}>
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          <span>{message.text}</span>
          <div className={styles.loadingBar}></div>
        </div>
      )}

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
          {isLogin ? "Does not have account? Register it" : "Login"}
        </button>
      </form>
    </div>
  );
}
