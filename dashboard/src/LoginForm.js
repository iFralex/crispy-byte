import React, { useState } from 'react';
import {SignIn} from "./firebase"

const LoginForm = ({ onSigned }) => {
  const [email, setEmail] = useState("Admin@pizza.com");
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    SignIn(email, password, onSigned);
  };

  return (
    <div className="container h-100 text-white pt-5">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Accedi</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Accedi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
