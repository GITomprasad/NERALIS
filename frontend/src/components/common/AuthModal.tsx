import React, { useState } from 'react';
import { usePlatform, UserRole } from '../../context/PlatformContext';
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
    openAuthModal,
    login,
    loginWithGoogle,
    signup,
    demoAccounts
  } = usePlatform();

  // Tab State: 'SIGNIN' | 'SIGNUP'
  const [tab, setTab] = useState<'SIGNIN' | 'SIGNUP'>(authModalMode || 'SIGNIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleGoogleSignIn = async (preset?: { name: string; email: string; role?: UserRole }) => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    const success = await loginWithGoogle({
      name: preset?.name || 'Google Verified Officer',
      email: preset?.email || 'officer.neralis@gmail.com',
      role: preset?.role || signUpRole || 'CITIZEN'
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
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Read-only map, routing, alerts & live broadcasts',
      icon: '👥'
    },
    {
      id: 'STATE_ADMIN',
      label: 'State Admin (MDoNER HQ)',
      badge: 'ADMIN',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Full author control, override road status & alerts',
      icon: '🏛️'
    },
    {
      id: 'DISTRICT_COLLECTOR',
      label: 'District Collector / DM',
      badge: 'AUTHORITY',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      desc: 'District approvals, relief convoys & emergency',
      icon: '🏢'
    },
    {
      id: 'LOGISTICS_OPERATOR',
      label: 'Logistics & Fleet Operator',
      badge: 'FLEET',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'NavIC truck telemetry & warehouse routing',
      icon: '🚛'
    },
    {
      id: 'FIELD_INSPECTOR',
      label: 'Field Inspector (PWD / SDRF)',
      badge: 'FIELD',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
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
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with GoI Emblem */}
        <div className="bg-[#17365D] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2563A8]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-amber-400">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white tracking-wide">NERALIS Portal Access</h3>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/40">
                  Govt of India
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Ministry of Development of North Eastern Region (MDoNER)
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        <div className="flex border-b border-gray-200 bg-slate-50 px-5 pt-3 shrink-0">
          <button
            onClick={() => { setTab('SIGNIN'); setErrorMessage(''); setShowGoogleChooser(false); }}
            className={`pb-2.5 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'SIGNIN'
                ? 'border-[#1E3A5F] text-[#1E3A5F] font-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setTab('SIGNUP'); setErrorMessage(''); setShowGoogleChooser(false); }}
            className={`pb-2.5 px-4 font-bold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              tab === 'SIGNUP'
                ? 'border-[#1E3A5F] text-[#1E3A5F] font-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-gray-700">
          {/* ------------------------------------------------------------- */}
          {/* PRIMARY: CONTINUE WITH GOOGLE BUTTON (Both Tabs)               */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowGoogleChooser(!showGoogleChooser)}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold border border-gray-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-gray-400 active:scale-[0.99] disabled:opacity-70"
            >
              {/* Official Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {isGoogleLoading ? 'Connecting to Google SSO...' : 'Continue with Google'}
              </span>
            </button>

            {/* Google Account Selector Dropdown (When Clicked) */}
            {showGoogleChooser && (
              <div className="p-3 bg-slate-50 border border-blue-200 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Select Google Account to Sign In:</span>
                  <span className="text-blue-600">Google SSO</span>
                </div>
                <div className="space-y-1">
                  {googlePresetAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGoogleSignIn(acc)}
                      className="w-full text-left p-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#4285F4] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {acc.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 group-hover:text-blue-900 truncate">
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{acc.email}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 uppercase">
                        {acc.badge}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleGoogleSignIn()}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    + Use Another Google Account
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Or Continue With Email
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>

          {tab === 'SIGNIN' ? (
            /* SIGN IN TAB */
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official or Personal Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. admin@mdoner.gov.in"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">Password</label>
                    <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#17365D] hover:bg-[#1E3A5F] text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Quick Demo Persona Logins (1-Click Switch)
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                    RBAC Sandbox
                  </span>
                </div>

                <div className="space-y-1.5">
                  {rolesConfig.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleQuickDemoLogin({ role_key: r.id, email: `${r.id.toLowerCase().replace('_', '.')}@neralis.gov.in` })}
                      disabled={isLoading}
                      className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{r.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 group-hover:text-blue-900 text-xs truncate">
                            {r.label}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{r.desc}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase shrink-0 ${r.badgeColor}`}>
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
                <label className="block font-bold text-gray-700 mb-1">Full Name & Official Designation *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Er. Tashi Wangchuk"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. inspector@pwd.gov.in"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Password * (≥ 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Governance Role Assignment *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rolesConfig.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSignUpRole(r.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                        signUpRole === r.id
                          ? 'border-[#1E3A5F] bg-blue-50/70 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="signupRole"
                        checked={signUpRole === r.id}
                        onChange={() => setSignUpRole(r.id)}
                        className="mt-0.5 text-blue-700 focus:ring-blue-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-gray-900 text-xs truncate">{r.label}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase ${r.badgeColor}`}>
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State Assignment</label>
                  <select
                    value={signUpState}
                    onChange={(e) => setSignUpState(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1E3A5F]"
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
                  <label className="block font-bold text-gray-700 mb-1">Assigned District / Station</label>
                  <input
                    type="text"
                    value={signUpDistrict}
                    onChange={(e) => setSignUpDistrict(e.target.value)}
                    placeholder="e.g. Tawang / East Khasi Hills"
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              {/* Organization & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department / Organization</label>
                  <input
                    type="text"
                    value={signUpOrg}
                    onChange={(e) => setSignUpOrg(e.target.value)}
                    placeholder="e.g. PWD / SDRF / NHIDCL"
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emergency Mobile Number</label>
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 94350 00000"
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-[#17365D] hover:bg-[#1E3A5F] text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Create & Activate NERALIS Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer / Compliance note */}
        <div className="p-3 bg-[#EBF3FB]/60 border-t border-gray-200 text-[10px] text-gray-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>MDoNER National Logistics Security Standard • Google OAuth 2.0 / SHA-256 RBAC</span>
          </div>
          <span className="font-mono">v2.2 Production</span>
        </div>
      </div>
    </div>
  );
};
