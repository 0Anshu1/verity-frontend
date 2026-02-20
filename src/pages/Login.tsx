import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login({ defaultSignUp = false }: { defaultSignUp?: boolean }) {
  const [isSignUp, setIsSignUp] = useState(defaultSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, orgName);
        // Don't navigate — show success and switch to login
        setSuccess('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setFullName('');
        setOrgName('');
        setPassword('');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-page__bg">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
        <div className="login-page__orb login-page__orb--3" />
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="login-card__logo">
          <h1 className="login-card__logo-text">verity</h1>
        </div>

        <h2 className="login-card__title">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="login-card__subtitle">
          {isSignUp
            ? 'Start verifying documents with AI'
            : 'Sign in to your document intelligence platform'}
        </p>

        {error && (
          <motion.div
            className="login-card__error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="login-card__success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-card__form">
          {isSignUp && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="login-card__input-wrap">
                  <User size={16} className="login-card__input-icon" />
                  <input
                    type="text"
                    className="input login-card__input"
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Organization</label>
                <div className="login-card__input-wrap">
                  <Building2 size={16} className="login-card__input-icon" />
                  <input
                    type="text"
                    className="input login-card__input"
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="login-card__input-wrap">
              <Mail size={16} className="login-card__input-icon" />
              <input
                type="email"
                className="input login-card__input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="login-card__input-wrap">
              <Lock size={16} className="login-card__input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input login-card__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="login-card__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-card__submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-card__spinner" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="login-card__toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            className="login-card__toggle-btn"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
