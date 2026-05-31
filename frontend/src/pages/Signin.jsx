import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useUser } from "../providers/UserContext";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post("/auth/login", { email: formData.email, password: formData.password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      await refreshUser();
      toast.success(`Welcome back, ${response.data.user.name}! 🎉`);
      navigate("/myevents");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-float"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${4 + Math.random() * 4}s` }} />
        ))}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center group-hover:from-red-400 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-red-900/30 relative overflow-hidden">
                  <div className="relative w-6 h-6">
                    <div className="absolute left-0 top-0 w-1.5 h-6 bg-white rounded-full shadow-lg"></div>
                    <div className="absolute left-0 top-0 w-4 h-1.5 bg-white rounded-full shadow-lg group-hover:w-5 transition-all duration-300"></div>
                    <div className="absolute left-0 top-2 w-3 h-1.5 bg-white rounded-full shadow-lg group-hover:w-4 transition-all duration-300 delay-75"></div>
                    <div className="absolute left-0 top-4 w-5 h-1.5 bg-white rounded-full shadow-lg group-hover:w-6 transition-all duration-300 delay-150"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-white tracking-tight">Event<span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">Ease</span></span>
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Welcome <span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">Back</span></h1>
            <p className="text-gray-400 text-sm">Sign in to your EventEase account</p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 shadow-2xl shadow-red-900/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="group">
                <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-2">Email Address *</label>
                <div className="relative">
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 pl-12"
                    placeholder="your.email@company.com" required />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 pl-12 pr-12"
                    placeholder="Enter your password" required />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-300">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="rememberMe" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange}
                    className="w-5 h-5 bg-black/40 border-gray-600 rounded focus:ring-red-500 focus:ring-2" />
                  <label htmlFor="rememberMe" className="ml-3 text-xs text-gray-300">Remember me</label>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className={`w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-900/30 border border-red-500/30 relative overflow-hidden group ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-red-500 hover:to-red-600"}`}>
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : <span className="relative z-10">Sign In to EventEase 🚀</span>}
              </button>
            </form>

            <div className="text-center mt-8 p-4 bg-black/30 rounded-xl border border-red-500/10">
              <p className="text-gray-400 text-sm mb-3">Don't have an account?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signuphost" className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-800/10 text-red-400 rounded-lg text-sm font-semibold hover:from-red-600/30 hover:to-red-800/20 transition-all duration-300 transform hover:scale-105 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center space-x-2">
                  <span>🎯</span><span>Sign up as Host</span>
                </Link>
                <Link to="/signupguest" className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-purple-400 rounded-lg text-sm font-semibold hover:from-purple-600/30 hover:to-blue-600/20 transition-all duration-300 transform hover:scale-105 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center space-x-2">
                  <span>🎪</span><span>Join as Guest</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[{ icon: "⚡", title: "Fast Access", desc: "Quick event discovery" }, { icon: "🔒", title: "Secure", desc: "Your data is protected" }, { icon: "🌟", title: "Personalized", desc: "Tailored recommendations" }].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/10 hover:border-red-500/20 transition-all duration-300 group hover:scale-105">
                <div className="text-xl mb-2">{feature.icon}</div>
                <div className="text-white text-xs font-semibold mb-1">{feature.title}</div>
                <div className="text-gray-400 text-xs">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
