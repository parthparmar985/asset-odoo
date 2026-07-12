import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, Calendar, Wrench, ShieldCheck, BarChart2, Shield, 
  Mail, Lock, Eye, EyeOff, Zap, Users, Cloud, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset body overflow when leaving login page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!isLogin) {
      if (!name) {
        toast.error('Please enter your full name');
        return;
      }
      if (!isPasswordValid) {
        toast.error('Please ensure your password meets all requirements');
        return;
      }
    }
    setLoading(true);
    let res = isLogin ? await login(email, password) : await register(name, email, password); 
    setLoading(false);
    if (res.success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      // No navigate() needed — App.jsx route guard auto-redirects when user state updates
    } else {
      toast.error(res.message || 'Authentication failed');
    }
  };

  const styles = {
    layoutContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      fontFamily: "'Inter', 'Outfit', sans-serif",
      backgroundColor: '#FFFFFF',
      overflow: 'hidden'
    },
    mainContent: {
      display: 'flex',
      flex: 1,
      height: 'calc(100vh - 80px)' // Account for footer
    },
    leftPane: {
      flex: '1 1 55%',
      backgroundColor: '#FFFFFF',
      padding: '2rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%'
    },
    rightPane: {
      flex: '1 1 45%',
      backgroundColor: '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      height: '100%'
    },
    rightPanePattern: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'radial-gradient(circle at 100% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
      pointerEvents: 'none'
    },
    footer: {
      height: '80px',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      padding: '0 4rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    footerFeatures: { display: 'flex', gap: '2.5rem' },
    footerFeatureItem: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    footerIconWrapper: {
      width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EFF6FF', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6'
    },
    footerFeatureText: { display: 'flex', flexDirection: 'column' },
    footerFeatureTitle: { fontWeight: '600', fontSize: '0.8rem', color: '#1E293B' },
    footerFeatureDesc: { fontSize: '0.7rem', color: '#64748B' },
    copyright: { fontSize: '0.75rem', color: '#64748B', textAlign: 'right', lineHeight: '1.4' },
    brand: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' },
    badgePill: {
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', backgroundColor: '#F0FDF4', 
      border: '1px solid #BBF7D0', borderRadius: '24px', color: '#166534', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem', width: 'fit-content'
    },
    heading: { fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: '#0F172A', marginBottom: '1rem', letterSpacing: '-0.02em' },
    subHeading: { fontSize: '1.1rem', color: '#475569', lineHeight: '1.5', maxWidth: '85%', marginBottom: '2rem' },
    iconsRow: { display: 'flex', gap: '2rem', marginBottom: '1rem' },
    iconBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '70px', textAlign: 'center' },
    iconWrapper: (color, bgColor) => ({
      width: '48px', height: '48px', borderRadius: '14px', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }),
    iconLabel: { fontSize: '0.7rem', fontWeight: '600', color: '#475569', lineHeight: '1.2' },
    authCard: {
      backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '440px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto'
    },
    shieldIconTop: {
      width: '40px', height: '40px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', margin: '0 auto 1rem auto'
    },
    authTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: '0.25rem' },
    authSubtitle: { fontSize: '0.9rem', color: '#64748B', textAlign: 'center', marginBottom: '1.5rem' },
    inputGroup: { marginBottom: '1rem' },
    labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#1E293B' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIconLeft: { position: 'absolute', left: '1rem', color: '#94A3B8' },
    inputIconRight: { position: 'absolute', right: '1rem', color: '#94A3B8', cursor: 'pointer' },
    input: { width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', color: '#0F172A', outline: 'none', transition: 'all 0.2s' },
    checkboxRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' },
    submitBtn: { width: '100%', padding: '0.875rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s', marginBottom: '1.25rem' },
    divider: { display: 'flex', alignItems: 'center', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '1.25rem' },
    dividerLine: { flex: 1, borderBottom: '1px solid #E2E8F0' },
    socialRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
    socialBtn: { flex: 1, padding: '0.6rem', backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#1E293B', cursor: 'pointer' },
    toggleText: { textAlign: 'center', fontSize: '0.85rem', color: '#64748B' },
    toggleLink: { color: '#2563EB', fontWeight: '600', cursor: 'pointer' },
    validationList: { marginTop: '0.5rem', padding: '0.6rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
    validationItem: (isValid) => ({ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: isValid ? '#059669' : '#64748B', fontWeight: isValid ? '500' : '400' })
  };

  return (
    <div style={styles.layoutContainer}>
      <style>
        {`
          .input-field:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important; }
          .submit-btn:hover { background-color: #1D4ED8 !important; }
          .social-btn:hover { background-color: #F8FAFC !important; }
          .auth-card::-webkit-scrollbar { width: 6px; }
          .auth-card::-webkit-scrollbar-track { background: transparent; }
          .auth-card::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
          .laptop-illustration { position: relative; width: 100%; height: 260px; margin-top: auto; perspective: 800px; transform: scale(0.9); transform-origin: bottom left; }
          .laptop-base { position: absolute; bottom: 20px; left: 45%; transform: translateX(-50%) rotateX(60deg) rotateZ(-45deg); width: 300px; height: 200px; background: #E2E8F0; border-radius: 12px; box-shadow: -15px 15px 25px rgba(0,0,0,0.1), inset 0 0 0 8px #CBD5E1; display: flex; align-items: center; justify-content: center; }
          .laptop-screen { position: absolute; bottom: 70px; left: 45%; transform: translateX(-50%) rotateY(-20deg) rotateX(10deg); width: 260px; height: 160px; background: #0F172A; border-radius: 8px; border: 4px solid #334155; box-shadow: 10px 10px 20px rgba(0,0,0,0.1); overflow: hidden; display: flex; align-items: center; justify-content: center; }
          .screen-content { width: 90%; height: 80%; background: #FFFFFF; border-radius: 4px; display: grid; grid-template-columns: 1fr 2fr; grid-template-rows: 1fr 1fr; gap: 4px; padding: 4px; }
          .screen-panel { background: #F1F5F9; border-radius: 2px; }
          .floating-asset { position: absolute; background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 12px; padding: 0.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); animation: float 4s ease-in-out infinite; }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        `}
      </style>

      <div style={styles.mainContent}>
        <div style={styles.leftPane}>
          <div style={styles.brand}><Box size={28} color="#2563EB" fill="#EFF6FF" /> AssetFlow</div>
          <div style={styles.badgePill}><CheckCircle2 size={14} fill="#22C55E" color="#FFFFFF" /> Enterprise Asset & Resource Management System</div>
          <h1 style={styles.heading}>Smart Assets.<br/><span style={{ color: '#2563EB' }}>Stronger Business.</span></h1>
          <p style={styles.subHeading}>Track, manage, and optimize your assets and resources through their entire lifecycle – from allocation to retirement.</p>
          
          <div style={styles.iconsRow}>
            <div style={styles.iconBox}><div style={styles.iconWrapper('#2563EB', '#EFF6FF')}><Box size={20} /></div><div style={styles.iconLabel}>Asset Tracking</div></div>
            <div style={styles.iconBox}><div style={styles.iconWrapper('#16A34A', '#F0FDF4')}><Calendar size={20} /></div><div style={styles.iconLabel}>Resource Booking</div></div>
            <div style={styles.iconBox}><div style={styles.iconWrapper('#7C3AED', '#F5F3FF')}><Wrench size={20} /></div><div style={styles.iconLabel}>Maintenance</div></div>
            <div style={styles.iconBox}><div style={styles.iconWrapper('#EA580C', '#FFF7ED')}><ShieldCheck size={20} /></div><div style={styles.iconLabel}>Compliance</div></div>
            <div style={styles.iconBox}><div style={styles.iconWrapper('#0284C7', '#F0F9FF')}><BarChart2 size={20} /></div><div style={styles.iconLabel}>Analytics</div></div>
          </div>

          <div className="laptop-illustration">
             <div className="floating-asset" style={{ top: '20px', left: '10%', animationDelay: '0s' }}><Box size={20} color="#2563EB" /></div>
             <div className="floating-asset" style={{ top: '60px', right: '15%', animationDelay: '1s' }}><Calendar size={20} color="#16A34A" /></div>
             <div className="floating-asset" style={{ bottom: '40px', left: '20%', animationDelay: '2s' }}><Wrench size={20} color="#7C3AED" /></div>
             <div className="laptop-screen">
                <div className="screen-content">
                  <div className="screen-panel" style={{ gridRow: 'span 2' }}></div><div className="screen-panel"></div><div className="screen-panel" style={{ backgroundColor: '#DBEAFE' }}></div>
                </div>
             </div>
             <div className="laptop-base"><div style={{ width: '80%', height: '50%', backgroundColor: '#CBD5E1', borderRadius: '4px', margin: '-10% auto 0 auto' }}></div></div>
          </div>
        </div>

        <div style={styles.rightPane}>
          <div style={styles.rightPanePattern}></div>
          <div style={styles.authCard} className="auth-card">
            <div style={styles.shieldIconTop}><Shield size={20} /></div>
            <h2 style={styles.authTitle}>{isLogin ? 'Welcome back!' : 'Create an account'}</h2>
            <p style={styles.authSubtitle}>{isLogin ? 'Sign in to continue to AssetFlow' : 'Join AssetFlow to manage your resources'}</p>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={styles.inputGroup}>
                  <div style={styles.labelRow}><label style={styles.label}>Full Name</label></div>
                  <div style={styles.inputWrapper}>
                    <Users size={16} style={styles.inputIconLeft} />
                    <input type="text" className="input-field" style={styles.input} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
              )}

              <div style={styles.inputGroup}>
                <div style={styles.labelRow}><label style={styles.label}>Email address</label></div>
                <div style={styles.inputWrapper}>
                  <Mail size={16} style={styles.inputIconLeft} />
                  <input type="email" className="input-field" style={styles.input} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize: '0.75rem', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>}
                </div>
                <div style={styles.inputWrapper}>
                  <Lock size={16} style={styles.inputIconLeft} />
                  <input type={showPassword ? 'text' : 'password'} className="input-field" style={styles.input} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {showPassword ? <EyeOff size={16} style={styles.inputIconRight} onClick={() => setShowPassword(false)} /> : <Eye size={16} style={styles.inputIconRight} onClick={() => setShowPassword(true)} />}
                </div>

                {!isLogin && password && (
                  <div style={styles.validationList}>
                    <div style={styles.validationItem(validations.length)}><CheckCircle2 size={12} /> At least 8 characters</div>
                    <div style={styles.validationItem(validations.uppercase)}><CheckCircle2 size={12} /> Contains uppercase letter</div>
                    <div style={styles.validationItem(validations.lowercase)}><CheckCircle2 size={12} /> Contains lowercase letter</div>
                    <div style={styles.validationItem(validations.number)}><CheckCircle2 size={12} /> Contains a number</div>
                    <div style={styles.validationItem(validations.special)}><CheckCircle2 size={12} /> Contains special character</div>
                  </div>
                )}
              </div>

              {isLogin && (
                <div style={styles.checkboxRow}>
                  <input type="checkbox" id="remember" style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#2563EB' }} />
                  <label htmlFor="remember" style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>Remember me</label>
                </div>
              )}

              <button type="submit" className="submit-btn" style={styles.submitBtn} disabled={loading}>
                {loading ? (isLogin ? 'Signing in...' : 'Creating...') : (isLogin ? 'Sign in' : 'Create account')} {!loading && <span>&rarr;</span>}
              </button>

              <div style={styles.divider}><div style={styles.dividerLine}></div><span style={{ padding: '0 0.75rem' }}>or continue with</span><div style={styles.dividerLine}></div></div>

              <div style={styles.socialRow}>
                <button type="button" className="social-btn" style={styles.socialBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="social-btn" style={styles.socialBtn}>
                  <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>
                  Microsoft
                </button>
              </div>

              <div style={styles.toggleText}>
                {isLogin ? 'New to AssetFlow? ' : 'Already have an account? '}
                <span style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setName(''); setPassword(''); }}>{isLogin ? 'Create an account' : 'Sign in'}</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerFeatures}>
          <div style={styles.footerFeatureItem}><div style={styles.footerIconWrapper}><Shield size={16} /></div><div style={styles.footerFeatureText}><span style={styles.footerFeatureTitle}>Enterprise Grade Security</span><span style={styles.footerFeatureDesc}>Your data is protected with industry-leading security</span></div></div>
          <div style={styles.footerFeatureItem}><div style={{...styles.footerIconWrapper, color: '#0284C7', backgroundColor: '#F0F9FF'}}><Zap size={16} /></div><div style={styles.footerFeatureText}><span style={styles.footerFeatureTitle}>Real-time Visibility</span><span style={styles.footerFeatureDesc}>Get instant insights into your assets and operations</span></div></div>
          <div style={styles.footerFeatureItem}><div style={{...styles.footerIconWrapper, color: '#7C3AED', backgroundColor: '#F5F3FF'}}><Users size={16} /></div><div style={styles.footerFeatureText}><span style={styles.footerFeatureTitle}>Role-based Access</span><span style={styles.footerFeatureDesc}>Secure access control for every team member</span></div></div>
          <div style={styles.footerFeatureItem}><div style={{...styles.footerIconWrapper, color: '#059669', backgroundColor: '#ECFDF5'}}><Cloud size={16} /></div><div style={styles.footerFeatureText}><span style={styles.footerFeatureTitle}>Scalable & Reliable</span><span style={styles.footerFeatureDesc}>Built to grow with your organization</span></div></div>
        </div>
        <div style={styles.copyright}>© {new Date().getFullYear()} AssetFlow Systems.<br/>All rights reserved.</div>
      </div>
    </div>
  );
};

export default Login;
