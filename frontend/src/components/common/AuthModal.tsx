import React, { useState, useEffect, useRef } from 'react';
import { usePlatform, UserRole } from '../../context/PlatformContext';
import { mountGoogleIdSignIn, getGoogleClientId } from '../../services/googleAuth';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Building,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Truck,
  BellRing,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    loginWithGoogle,
    signup,
  } = usePlatform();

  // Tab State: 'SIGNIN' | 'SIGNUP'
  const [tab, setTab] = useState<'SIGNIN' | 'SIGNUP'>(authModalMode || 'SIGNIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasGoogleClientId, setHasGoogleClientId] = useState(false);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('CITIZEN');
  const [signUpState, setSignUpState] = useState('Assam');
  const [signUpDistrict, setSignUpDistrict] = useState('Kamrup Metropolitan');
  const [signUpOrg, setSignUpOrg] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');

  useEffect(() => {
    const clientId = getGoogleClientId();
    setHasGoogleClientId(!!clientId);

    if (isAuthModalOpen && googleButtonContainerRef.current && clientId) {
      mountGoogleIdSignIn(
        googleButtonContainerRef.current,
        async (credential, payload) => {
          setIsGoogleLoading(true);
          setErrorMessage('');
          try {
            const success = await loginWithGoogle({
              credential,
              name: payload?.name,
              email: payload?.email,
              photo_url: payload?.picture,
              google_id: payload?.sub,
              role: signUpRole || 'CITIZEN'
            });
            if (!success) {
              setErrorMessage('Google ID token verification failed on server.');
            }
          } catch (err: any) {
            setErrorMessage(err?.message || 'Google ID-token authentication failed.');
          } finally {
            setIsGoogleLoading(false);
          }
        },
        {
          text: tab === 'SIGNUP' ? 'signup_with' : 'continue_with',
          theme: 'outline'
        }
      );
    }
  }, [isAuthModalOpen, tab, signUpRole, loginWithGoogle]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const success = await login(signInEmail, signInPassword);
    setIsLoading(false);
    if (!success) {
      setErrorMessage('Invalid credentials. Check your email or use Quick Demo Sign In below.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setErrorMessage('Please fill in all required fields (Name, Email, Password).');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const success = await signup({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      role: signUpRole,
      state: signUpState,
      district: signUpDistrict,
      organization: signUpOrg,
      phone: signUpPhone
    });
    setIsLoading(false);
    if (!success) {
      setErrorMessage('Registration failed. This email may already be registered.');
    }
  };

  const handleGooglePresetSignIn = async (preset?: { name: string; email: string; role?: UserRole }) => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    const success = await loginWithGoogle({
      name: preset?.name || 'Google Sandbox Officer',
      email: preset?.email || 'officer.sandbox@neralis.gov.in',
      role: preset?.role || signUpRole || 'CITIZEN',
      is_sandbox: true
    });
    setIsGoogleLoading(false);
    setShowGoogleChooser(false);
  };

  const handleQuickDemoLogin = async (acc: any) => {
    setIsLoading(true);
    setErrorMessage('');
    await login(acc.email, acc.password || `${acc.role_key.toLowerCase()}123`);
    setIsLoading(false);
  };

  const rolesConfig: { id: UserRole; label: string; badge: string; badgeColor: string; desc: string; icon: string }[] = [
    {
      id: 'CITIZEN',
      label: 'Citizen / Public Traveler',
      badge: 'PUBLIC',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc: 'Read-only map, routing, alerts & live broadcasts',
      icon: '👥'
    },
    {
      id: 'STATE_ADMIN',
      label: 'State Admin (MDoNER HQ)',
      badge: 'ADMIN',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-[#990011]/30',
      desc: 'Full author control, override road status & alerts',
      icon: '🏛️'
    },
    {
      id: 'DISTRICT_COLLECTOR',
      label: 'District Collector / DM',
      badge: 'AUTHORITY',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      desc: 'District approvals, relief convoys & emergency',
      icon: '🏢'
    },
    {
      id: 'LOGISTICS_OPERATOR',
      label: 'Logistics & Fleet Operator',
      badge: 'FLEET',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc: 'NavIC truck telemetry & warehouse routing',
      icon: '🚛'
    },
    {
      id: 'FIELD_INSPECTOR',
      label: 'Field Inspector (PWD / SDRF)',
      badge: 'FIELD',
      badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      desc: 'On-ground damage logging & AR crack scans',
      icon: '👷'
    }
  ];

  const googlePresetAccounts = [
    {
      name: 'Ramesh Sarma',
      email: 'ramesh.sarma.ner@gmail.com',
      avatar: 'R',
      role: 'CITIZEN' as UserRole,
      badge: 'PUBLIC'
    },
    {
      name: 'J. K. Lyngdoh (IAS)',
      email: 'jk.lyngdoh.mdoner@gmail.com',
      avatar: 'J',
      role: 'STATE_ADMIN' as UserRole,
      badge: 'ADMIN'
    },
    {
      name: 'Ananya Barman',
      email: 'ananya.barman.dm@gmail.com',
      avatar: 'A',
      role: 'DISTRICT_COLLECTOR' as UserRole,
      badge: 'AUTHORITY'
    }
  ];

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FCF6F5] rounded-2xl max-w-xl w-full border border-[#E7DAD8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with GoI Emblem */}
        <div className="bg-[#FCF6F5] text-[#252124] p-4 sm:p-5 flex items-center justify-between border-b border-[#E7DAD8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 p-1.5 flex items-center justify-center border border-[#990011]/30 shrink-0">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#19C6D2]">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#252124] tracking-wide">NERALIS Portal Access</h3>
                <span className="bg-amber-500/20 text-[#FFB547] text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  Govt of India
                </span>
              </div>
              <p className="text-[11px] text-[#786D6D]">
                Ministry of Development of North Eastern Region (MDoNER)
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg bg-[#FFFFFF] hover:bg-[#EDE4E2] text-[#786D6D] hover:text-[#252124] flex items-center justify-center transition-colors cursor-pointer border border-[#E7DAD8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        <div className="flex border-b border-[#E7DAD8] bg-[#FCF6F5] px-5 pt-3 shrink-0 gap-2">
          <button
            onClick={() => { setTab('SIGNIN'); setErrorMessage(''); setShowGoogleChooser(false); }}
            className={`pb-2.5 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'SIGNIN'
                ? 'border-[#990011] text-[#990011] font-black'
                : 'border-transparent text-[#786D6D] hover:text-[#786D6D]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setTab('SIGNUP'); setErrorMessage(''); setShowGoogleChooser(false); }}
            className={`pb-2.5 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'SIGNUP'
                ? 'border-[#990011] text-[#990011] font-black'
                : 'border-transparent text-[#786D6D] hover:text-[#786D6D]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#FF5252] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-[#786D6D]">
          {/* PRIMARY: GOOGLE IDENTITY SERVICES ID-TOKEN BUTTON */}
          <div className="space-y-2.5">
            {hasGoogleClientId ? (
              <div className="w-full flex flex-col items-center justify-center min-h-[44px]">
                <div ref={googleButtonContainerRef} className="w-full flex justify-center" />
              </div>
            ) : (
              <div className="p-3 bg-[#FFFFFF] border border-amber-500/30 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#FFB547] font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-[#FFB547] shrink-0" />
                  <span>Google Client ID setup required for live Google Sign-In</span>
                </div>
                <p className="text-[11px] text-[#786D6D] leading-relaxed">
                  Add <code className="bg-[#FCF6F5] text-amber-300 px-1 py-0.5 rounded font-mono text-[10px]">VITE_GOOGLE_CLIENT_ID</code> to your <code className="bg-[#FCF6F5] text-amber-300 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> for live ID-token verification. For instant testing, use a Sandbox account below.
                </p>
              </div>
            )}

            {isGoogleLoading && (
              <div className="py-2 text-center text-xs font-semibold text-[#990011] flex items-center justify-center gap-2 animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-[#990011] border-t-transparent rounded-full animate-spin" />
                <span>Verifying Google ID Token with Backend...</span>
              </div>
            )}

            {/* Sandbox / Demo Preset Selector Toggle */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <span className="text-[#786D6D] font-medium">Google Identity Services (GIS)</span>
              <button
                type="button"
                onClick={() => setShowGoogleChooser(!showGoogleChooser)}
                className="text-[#990011] hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
              >
                {showGoogleChooser ? 'Hide Sandbox Profiles' : '⚡ Test with Sandbox Account'}
              </button>
            </div>

            {/* Google Account Selector Dropdown */}
            {showGoogleChooser && (
              <div className="p-3 bg-[#FCF6F5] border border-[#990011]/30 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#786D6D] uppercase tracking-wider">
                  <span>Sandbox / Demo Google Profiles:</span>
                  <span className="text-[#990011]">Simulated SSO Fallback</span>
                </div>
                <div className="space-y-1.5">
                  {googlePresetAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGooglePresetSignIn(acc)}
                      className="w-full text-left p-2.5 bg-[#FFFFFF] hover:bg-[#EDE4E2] border border-[#E7DAD8] hover:border-[#990011]/40 rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#4285F4] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {acc.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#252124] group-hover:text-[#990011] truncate">
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-[#786D6D] truncate">{acc.email}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FCF6F5] text-[#786D6D] border border-[#E7DAD8] uppercase">
                        {acc.badge}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleGooglePresetSignIn()}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-[#990011] hover:underline cursor-pointer"
                  >
                    + Use Default Sandbox Google Account
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#E7DAD8]"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#786D6D] tracking-wider">
                Or Continue With Email
              </span>
              <div className="flex-grow border-t border-[#E7DAD8]"></div>
            </div>
          </div>

          {tab === 'SIGNIN' ? (
            /* SIGN IN TAB */
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block font-bold text-[#252124] mb-1">Official or Personal Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786D6D]" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. admin@mdoner.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011] focus:ring-1 focus:ring-[#990011]/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#252124]">Password</label>
                    <span className="text-[10px] text-[#990011] hover:underline cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786D6D]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-9 py-2.5 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011] focus:ring-1 focus:ring-[#990011]/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786D6D] hover:text-[#252124]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 btn-primary font-bold rounded-xl shadow-command-card transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Login Cards Section */}
              <div className="pt-3 border-t border-[#E7DAD8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#786D6D] uppercase tracking-wider">
                    Quick Demo Persona Logins (1-Click Switch)
                  </span>
                  <span className="text-[9px] bg-[#FFFFFF] text-[#990011] px-1.5 py-0.5 rounded font-mono font-bold border border-[#E7DAD8]">
                    RBAC Sandbox
                  </span>
                </div>

                <div className="space-y-1.5">
                  {rolesConfig.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleQuickDemoLogin({ role_key: r.id, email: `${r.id.toLowerCase().replace('_', '.')}@neralis.gov.in` })}
                      disabled={isLoading}
                      className="w-full text-left p-2.5 rounded-xl border border-[#E7DAD8] hover:border-[#990011]/40 bg-[#FFFFFF] hover:bg-[#152336] transition-all flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{r.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-[#252124] group-hover:text-[#990011] text-xs truncate">
                            {r.label}
                          </div>
                          <div className="text-[10px] text-[#786D6D] truncate">{r.desc}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase shrink-0 ${r.badgeColor}`}>
                        {r.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* SIGN UP TAB */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block font-bold text-[#252124] mb-1">Full Name & Official Designation *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786D6D]" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Er. Tashi Wangchuk"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011] focus:ring-1 focus:ring-[#990011]/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252124] mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786D6D]" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. inspector@pwd.gov.in"
                      className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011] focus:ring-1 focus:ring-[#990011]/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#252124] mb-1">Password * (≥ 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786D6D]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full pl-9 pr-9 py-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011] focus:ring-1 focus:ring-[#990011]/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786D6D] hover:text-[#252124]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-[#252124] mb-1.5">Governance Role Assignment *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rolesConfig.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSignUpRole(r.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                        signUpRole === r.id
                          ? 'border-[#990011] bg-cyan-950/30 shadow-command-card'
                          : 'border-[#E7DAD8] hover:border-[#E7DAD8] bg-[#FFFFFF]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="signupRole"
                        checked={signUpRole === r.id}
                        onChange={() => setSignUpRole(r.id)}
                        className="mt-0.5 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#252124] text-xs truncate">{r.label}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase ${r.badgeColor}`}>
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#786D6D] mt-0.5 leading-tight">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252124] mb-1">State Assignment</label>
                  <select
                    value={signUpState}
                    onChange={(e) => setSignUpState(e.target.value)}
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs font-medium text-[#252124] focus:border-[#990011]"
                  >
                    <option value="Assam">Assam</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tripura">Tripura</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#252124] mb-1">Assigned District / Station</label>
                  <input
                    type="text"
                    value={signUpDistrict}
                    onChange={(e) => setSignUpDistrict(e.target.value)}
                    placeholder="e.g. Tawang / East Khasi Hills"
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011]"
                  />
                </div>
              </div>

              {/* Organization & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252124] mb-1">Department / Organization</label>
                  <input
                    type="text"
                    value={signUpOrg}
                    onChange={(e) => setSignUpOrg(e.target.value)}
                    placeholder="e.g. PWD / SDRF / NHIDCL"
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252124] mb-1">Emergency Mobile Number</label>
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 94350 00000"
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E7DAD8] rounded-xl text-xs text-[#252124] placeholder-[#786D6D] focus:border-[#990011]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 btn-primary font-bold rounded-xl shadow-command-card transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                    <span>Create & Activate NERALIS Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer / Compliance note */}
        <div className="p-3 bg-[#FCF6F5] border-t border-[#E7DAD8] text-[10px] text-[#786D6D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#20C997]" />
            <span>MDoNER National Logistics Security Standard • Google OAuth 2.0 / SHA-256 RBAC</span>
          </div>
          <span className="font-mono text-[#990011]">v2.2 Production</span>
        </div>
      </div>
    </div>
  );
};
