import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/features/auth';
import { Award, Sparkles, TrendingUp, Users, Shield, CheckCircle2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          
          {/* Floating orbs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
          
          <div className="relative z-10 space-y-12">
            {/* Logo & Brand */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">LinkedIn Creative Awards</h1>
                  <p className="text-blue-100 text-xs">Admin Portal</p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Empower Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                    Awards Program
                  </span>
                </h2>
                <p className="text-blue-100 text-lg">
                  Manage nominees, track votes, and celebrate excellence
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Real-time Analytics</h3>
                <p className="text-blue-100 text-sm">Live voting & engagement metrics</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Easy Management</h3>
                <p className="text-blue-100 text-sm">Streamlined nominee control</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Secure Platform</h3>
                <p className="text-blue-100 text-sm">Enterprise-grade security</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Smart Insights</h3>
                <p className="text-blue-100 text-sm">AI-powered recommendations</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm">Trusted by 500+ organizations</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm">99.9% uptime guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm">24/7 dedicated support</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-blue-100 text-sm">
            <p>© 2024 LinkedIn Creative Awards</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">LinkedIn Creative Awards</h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 animate-slide-up">
            <LoginForm />
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Need assistance?{' '}
              <a href="mailto:support@linkedincreativeawards.com" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2">
                Contact Support
              </a>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-grid-white\\/\\[0\\.05\\] {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
