import { Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:8080';

export default function LoginRegistrationView({ setAuth, auth, setIsLoggedIn, setCurrentView, message, setMessage }) {
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [auth]);

  const validateForm = () => {
    let emailError = '';
    let passwordError = '';

    if (!auth.email.includes('@') || auth.email.length < 5) {
      emailError = 'Email inválido.';
    }

    if (auth.password.length < 6) {
      passwordError = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setErrors({ email: emailError, password: passwordError });
    setIsValid(!emailError && !passwordError);
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuth(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleLogin = async () => {
    if (!isValid) return;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: auth.email, senha: auth.password }),
      });
      const data = await response.text();

      if (response.ok) {
        setIsLoggedIn(true);
        setMessage('Login realizado com sucesso!');
        setCurrentView('cep-search');
      } else {
        setMessage(data || 'Erro ao fazer login.');
      }
    } catch (error) {
      setMessage('Erro de conexão com a API.');
    }
  };

  const handleRegister = async () => {
    if (!isValid) return;

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: auth.email, senha: auth.password }),
      });
      const data = await response.text();

      if (response.ok) {
        setMessage('Usuário cadastrado com sucesso! Faça login.');
      } else {
        setMessage(data || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      setMessage('Erro de conexão com a API.');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Bem-vindo</h2>
          <p className="text-muted mb-0">Acesse sua conta ou registre-se</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="input-group">
            <span className="input-group-text"><Mail size={18} /></span>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Digite seu email"
              value={auth.email}
              onChange={handleAuthChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Senha</label>
          <div className="input-group">
            <span className="input-group-text"><Lock size={18} /></span>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Digite sua senha"
              value={auth.password}
              onChange={handleAuthChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-primary" onClick={handleLogin} disabled={!isValid}>
            Entrar
          </button>
          <button className="btn btn-outline-secondary" onClick={handleRegister} disabled={!isValid}>
            Cadastrar
          </button>
        </div>

        {message && (
          <div className="alert alert-info mt-3 text-center p-2" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
