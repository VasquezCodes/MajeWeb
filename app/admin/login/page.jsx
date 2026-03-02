'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  .admin-login-root {
    min-height: 100vh;
    background-color: #FAF7F4;
    background-image:
      radial-gradient(ellipse 80% 60% at 15% 10%, rgba(218, 134, 149, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 90%, rgba(168, 181, 160, 0.10) 0%, transparent 55%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  .admin-login-wrapper {
    width: 100%;
    max-width: 420px;
    animation: adminFadeUp 0.7s ease-out both;
  }

  @keyframes adminFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .admin-login-brand {
    text-align: center;
    margin-bottom: 2rem;
    animation: adminFadeUp 0.7s 0.1s ease-out both;
  }

  .admin-login-monogram {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #DA8695 0%, #A8B5A0 100%);
    margin-bottom: 1.25rem;
    box-shadow: 0 8px 24px rgba(218, 134, 149, 0.25);
  }

  .admin-login-monogram-letter {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .admin-login-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #2D2D2D;
    margin: 0 0 0.35rem;
    letter-spacing: -0.02em;
  }

  .admin-login-subtitle {
    font-size: 0.85rem;
    color: #A8B5A0;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
  }

  .admin-login-card {
    background: #fff;
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid #F0E8E2;
    box-shadow:
      0 2px 4px rgba(0,0,0,0.04),
      0 8px 32px rgba(218, 134, 149, 0.06),
      0 20px 48px rgba(0,0,0,0.05);
    animation: adminFadeUp 0.7s 0.2s ease-out both;
  }

  .admin-login-error {
    background: #FFF1F3;
    border: 1px solid #F7C5CC;
    color: #9B3A4A;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .admin-login-field {
    margin-bottom: 1.25rem;
  }

  .admin-login-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 500;
    color: #8A7E8A;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
  }

  .admin-login-input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 1rem;
    border: 1.5px solid #EDE5DF;
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: 'DM Sans', sans-serif;
    color: #2D2D2D;
    background: #FAF7F4;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .admin-login-input::placeholder {
    color: #C8BFB8;
  }

  .admin-login-input:focus {
    border-color: #DA8695;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(218, 134, 149, 0.12);
  }

  .admin-login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    background: #DA8695;
    color: #fff;
    box-shadow: 0 4px 16px rgba(218, 134, 149, 0.3);
    margin-top: 0.5rem;
  }

  .admin-login-btn:hover:not(:disabled) {
    background: #C4717F;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(218, 134, 149, 0.4);
  }

  .admin-login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .admin-login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .admin-login-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: adminSpin 0.7s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes adminSpin {
    to { transform: rotate(360deg); }
  }

  .admin-login-footer {
    text-align: center;
    margin-top: 1.5rem;
    animation: adminFadeUp 0.7s 0.3s ease-out both;
  }

  .admin-login-footer-text {
    font-size: 0.78rem;
    color: #C0B8B2;
    letter-spacing: 0.04em;
  }

  .admin-login-hint {
    background: #F5F9F5;
    border: 1px solid #D4E2D0;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 1rem;
    text-align: left;
  }

  .admin-login-hint-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: #6A8A65;
    margin: 0 0 0.5rem;
  }

  .admin-login-hint-list {
    font-size: 0.78rem;
    color: #7B9A75;
    margin: 0;
    padding-left: 1.2rem;
    line-height: 1.8;
  }
`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Error de login:', err);

      let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = 'Email o contraseña incorrectos.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No existe un usuario con este email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'El formato del email es inválido.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-login-root">
        <div className="admin-login-wrapper">

          {/* Brand */}
          <div className="admin-login-brand">
            <div className="admin-login-monogram">
              <span className="admin-login-monogram-letter">M</span>
            </div>
            <h1 className="admin-login-title">Panel de Administración</h1>
            <p className="admin-login-subtitle">Maje Nail Spa & Academy</p>
          </div>

          {/* Card */}
          <div className="admin-login-card">
            {error && (
              <div className="admin-login-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-login-field">
                <label htmlFor="email" className="admin-login-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-login-input"
                  placeholder="admin@majeweb.com"
                />
              </div>

              <div className="admin-login-field">
                <label htmlFor="password" className="admin-login-label">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-login-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-login-btn"
              >
                {loading && <span className="admin-login-spinner" />}
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="admin-login-footer">
            <p className="admin-login-footer-text">Acceso restringido · Solo administradoras</p>
            {error && error.includes('Email o contraseña incorrectos') && (
              <div className="admin-login-hint">
                <p className="admin-login-hint-title">¿Primera vez en el panel?</p>
                <ol className="admin-login-hint-list">
                  <li>Habilitá Authentication en Firebase Console</li>
                  <li>Creá un usuario en Authentication → Users</li>
                  <li>Usá esas credenciales para iniciar sesión</li>
                </ol>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
