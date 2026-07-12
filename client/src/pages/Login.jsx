import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Box } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For Profile Picture Upload
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!isLogin && !name) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!isLogin && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password); 
    }
    
    setLoading(false);
    if (res.success) {
      toast.success(isLogin ? 'Welcome back to AssetFlow!' : 'Account created successfully!');
      navigate('/');
    } else {
      toast.error(res.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-container">
      <style>
        {`
          .login-container {
            display: flex;
            min-height: 100vh;
            font-family: 'Outfit', sans-serif;
            background-color: #0B0F19; /* Deep dark background */
          }
          
          /* Left Marketing Pane */
          .marketing-pane {
            flex: 1;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%);
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 4rem;
            color: white;
            overflow: hidden;
          }
          
          .marketing-pane::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%),
                        radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.4) 0%, transparent 40%);
            pointer-events: none;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: auto;
            z-index: 1;
          }

          .hero-text {
            z-index: 1;
            margin-bottom: auto;
          }
          
          .hero-text h1 {
            font-size: 3.5rem;
            line-height: 1.1;
            font-weight: 800;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
          }
          
          .hero-text p {
            font-size: 1.25rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.8);
            max-width: 80%;
          }
          
          .footer-text {
            z-index: 1;
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
          }

          /* Right Auth Pane */
          .auth-pane {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #0B0F19;
            padding: 2rem;
          }
          
          .auth-card {
            width: 100%;
            max-width: 440px;
            background: #151C2C;
            border: 1px solid #1E293B;
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.5s ease-out forwards;
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .auth-header h2 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.5rem;
          }
          
          .auth-header p {
            color: #94A3B8;
            font-size: 0.95rem;
            margin-bottom: 2rem;
          }

          /* Form Elements (Dark Mode) */
          .input-dark {
            width: 100%;
            padding: 0.875rem 1rem;
            background: #0B0F19;
            border: 1px solid #1E293B;
            border-radius: 12px;
            color: #F8FAFC;
            font-size: 1rem;
            transition: all 0.2s;
            margin-bottom: 1.25rem;
          }
          
          .input-dark:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }
          
          .label-dark {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #CBD5E1;
            margin-bottom: 0.5rem;
          }
          
          .btn-primary-dark {
            width: 100%;
            padding: 0.875rem;
            background: #3B82F6;
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 0.5rem;
          }
          
          .btn-primary-dark:hover {
            background: #2563EB;
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
          }
          
          .btn-primary-dark:disabled {
            background: #1E3A8A;
            cursor: not-allowed;
            transform: none;
          }
          
          /* Avatar Upload */
          .avatar-upload-dark {
            position: relative;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 2px dashed #3B82F6;
            margin: 0 0 1.5rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0B0F19;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .avatar-upload-dark:hover {
            border-style: solid;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
          }
          .camera-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            color: white;
          }
          .avatar-upload-dark:hover .camera-overlay {
            opacity: 1;
          }
          
          /* Toggle Link */
          .toggle-link {
            text-align: center;
            margin-top: 2rem;
            color: #94A3B8;
            font-size: 0.9rem;
          }
          .toggle-link span {
            color: #3B82F6;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.2s;
            margin-left: 0.25rem;
          }
          .toggle-link span:hover {
            color: #60A5FA;
            text-decoration: underline;
          }

          /* Responsive */
          @media (max-width: 992px) {
            .login-container {
              flex-direction: column;
            }
            .marketing-pane {
              padding: 3rem 2rem;
              flex: none;
            }
            .hero-text h1 {
              font-size: 2.5rem;
            }
            .hero-text p {
              max-width: 100%;
            }
            .auth-pane {
              padding: 2rem 1rem;
              align-items: flex-start;
            }
            .auth-card {
              padding: 2rem;
              box-shadow: none;
              border: none;
              background: transparent;
            }
          }
        `}
      </style>

      {/* Left Pane - Marketing */}
      <div className="marketing-pane">
        <div className="brand">
          <Box size={32} color="#ffffff" />
          AssetFlow
        </div>
        
        <div className="hero-text">
          <h1>Enterprise asset intelligence, without the enterprise sprawl.</h1>
          <p>Track every asset from procurement to retirement. Allocations, maintenance, audits, and bookings — all in one seamlessly connected platform.</p>
        </div>
        
        <div className="footer-text">
          © {new Date().getFullYear()} AssetFlow Systems. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Auth */}
      <div className="auth-pane">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Sign in' : 'Create an account'}</h2>
            <p>{isLogin ? 'Welcome back. Sign in to continue.' : 'Join AssetFlow and start managing efficiently.'}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            
            {/* Interactive Profile Picture (Only in Signup) */}
            {!isLogin && (
              <div 
                className="avatar-upload-dark"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Profile Picture"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={24} color="#3B82F6" />
                )}
                
                <div className="camera-overlay">
                  <Camera size={20} />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label className="label-dark">Full Name</label>
                <input 
                  type="text" 
                  className="input-dark" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            )}
            
            <div>
              <label className="label-dark">Email</label>
              <input 
                type="email" 
                className="input-dark" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="label-dark" style={{ margin: 0 }}>Password</label>
                {isLogin && (
                  <a href="#" style={{ fontSize: '0.8rem', color: '#3B82F6', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input 
                type="password" 
                className="input-dark" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="btn-primary-dark" disabled={loading}>
              {loading ? (isLogin ? 'Signing in...' : 'Creating...') : (isLogin ? 'Sign in' : 'Create account')}
            </button>
            
            <div className="toggle-link">
              {isLogin ? 'New to AssetFlow?' : 'Already have an account?'} 
              <span onClick={() => {
                setIsLogin(!isLogin);
                setPreviewUrl(null);
                setName('');
                setPassword('');
              }}>
                {isLogin ? 'Create an account' : 'Sign in'}
              </span>
            </div>
            
            {!isLogin && (
              <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748B', textAlign: 'center', lineHeight: '1.5' }}>
                By creating an account, you agree to our Terms of Service. <br/>Note: Admin privileges are assigned post-registration.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
