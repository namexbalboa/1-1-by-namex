import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, loading, error, isAuthenticated, collaborator } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Navigate to dashboard when authentication is complete
  useEffect(() => {
    if (isAuthenticated && collaborator && !loading) {
      console.log('✅ Auth complete, navigating to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, collaborator, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      // Navigation will happen automatically via useEffect when auth completes
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 -left-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute top-20 -right-24 w-80 h-80 bg-gradient-to-br from-accent/15 to-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>

      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md p-10 space-y-8 glass relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-block p-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 rounded-2xl mb-2 shadow-lg">
            <svg className="w-10 h-10 text-primary drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gradient">
            {t('meeting.title')}
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">{t('auth.loginTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg backdrop-blur-sm">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/90">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-refined w-full"
              placeholder="seu-email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground/90">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-refined w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary via-accent to-primary bg-size-200 text-white font-semibold rounded-xl
                     hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300 relative overflow-hidden group"
            style={{ backgroundSize: '200% 100%' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? t('common.loading') : t('auth.login')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-accent opacity-0 group-hover:opacity-100 transition-all duration-500"
                 style={{ backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}></div>
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">ou</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-primary hover:text-accent font-semibold transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
