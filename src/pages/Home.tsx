import React, { useState } from "react";
import "./styles/Home.css"; // Importa o CSS específico para esse componente

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email enviado:", email);
    // Aqui você pode realizar ações, como redirecionar o usuário ou salvar o e-mail
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome</h1>
      <form className="home-form" onSubmit={handleSubmit}>
        <label className="home-label" htmlFor="email">
          Enter your e-mail:
        </label>
        <input
          className="home-input"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@email.com"
        />
        <button className="home-button" type="submit">
          Entrar
        </button>
        <div className="explain-dialog">
            <p>Just to keep a process control over the application.</p>
        </div>
      </form>
    </div>
  );
};

export default Home;
