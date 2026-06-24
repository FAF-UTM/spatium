import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './login.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

const Login: React.FC = () => {
  const { lang = 'ro' } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(identifier.trim(), password);
      // Admins land on the dashboard; everyone else goes home.
      navigate(user.role === 'admin' ? `/${lang}/admin` : `/${lang}/`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.login_page}>
      <Navbar />
      <div className={styles.login_wrapper}>
        <form className={styles.login_card} onSubmit={handleSubmit}>
          <h1 className={styles.login_title}>Sign in</h1>
          <p className={styles.login_subtitle}>Access the Spatium admin area</p>

          {error && <div className={styles.login_error}>{error}</div>}

          <label className={styles.login_label} htmlFor="identifier">
            Username or email
          </label>
          <input
            id="identifier"
            type="text"
            className={styles.login_input}
            value={identifier}
            autoComplete="username"
            required
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <label className={styles.login_label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.login_input}
            value={password}
            autoComplete="current-password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className={styles.login_button} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <Link to={`/${lang}/`} className={styles.login_back}>
            ← Back to site
          </Link>
        </form>
      </div>
      <Footer button={false} style={{ marginTop: '0px' }} />
    </div>
  );
};

export default Login;
