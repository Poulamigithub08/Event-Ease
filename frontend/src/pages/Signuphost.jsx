import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Signup() {
  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    eventType: "",
    phone: "",
    acceptedTerms: false,
  };

  const [data, setData] = useState(emptyUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Simulate API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) { toast.error("Passwords do not match!"); return; }
    if (data.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setIsSubmitting(true);

    try {
      await API.post("/auth/register", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "host",
      });

      toast.success("🎉 Host account created successfully!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    "Professional Event Planner",
    "Venue Manager",
    "Corporate Event Manager",
    "Wedding Planner",
    "Conference Organizer",
    "Party Coordinator",
    "Other",
  ];

  const eventTypes = [
    "Corporate Events",
    "Weddings",
    "Conferences",
    "Parties & Social Events",
    "Workshops & Seminars",
    "Concerts & Performances",
    "Multiple Event Types",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header with Animated Logo */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="flex items-center justify-center space-x-3 mb-6 group"
            >
              {/* Animated Logo from Header.jsx */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center group-hover:from-red-400 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-red-900/30 relative overflow-hidden">
                  <div className="relative w-6 h-6">
                    <div className="absolute left-0 top-0 w-1.5 h-6 bg-white rounded-full shadow-lg animate-pulse-slow"></div>
                    <div className="absolute left-0 top-0 w-4 h-1.5 bg-white rounded-full shadow-lg group-hover:w-5 transition-all duration-300"></div>
                    <div className="absolute left-0 top-2 w-3 h-1.5 bg-white rounded-full shadow-lg group-hover:w-4 transition-all duration-300 delay-75"></div>
                    <div className="absolute left-0 top-4.5 w-5 h-1.5 bg-white rounded-full shadow-lg group-hover:w-6 transition-all duration-300 delay-150"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce shadow-lg shadow-yellow-400/50"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-300 shadow-lg shadow-yellow-300/50"></div>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-white group-hover:text-red-100 transition-colors duration-500 tracking-tight">
                  Event
                  <span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text drop-shadow-lg">
                    Ease
                  </span>
                </span>
                <span className="text-[8px] text-red-400/70 font-medium tracking-widest uppercase -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:delay-300">
                  Effortless • Elegant • Exceptional
                </span>
              </div>
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Become an{" "}
              <span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">
                Event Host
              </span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Create and manage amazing events with our professional hosting
              platform
            </p>
          </div>

          {/* Enhanced Creative Form */}
          <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 shadow-2xl shadow-red-900/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50"
                      placeholder="Enter first name"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      👤
                    </div>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50"
                      placeholder="Enter last name"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      👤
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                               placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 pl-10"
                    placeholder="your.email@company.com"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ✉️
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                               placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📞
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Your Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={data.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 appearance-none"
                    >
                      <option value="">Select your role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      ⬇️
                    </div>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Company/Organization
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={data.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50"
                      placeholder="Your company name"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      🏢
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Primary Event Type
                </label>
                <div className="relative">
                  <select
                    name="eventType"
                    value={data.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                               focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 appearance-none"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    🎭
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 pl-10 pr-10"
                      placeholder="Create password"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔒
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={data.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all duration-300 group-hover:border-red-500/50 pl-10 pr-10"
                      placeholder="Confirm password"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔒
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-black/30 rounded-xl border border-red-500/10 hover:border-red-500/20 transition-all duration-300">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    checked={data.acceptedTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 bg-black/40 border-gray-600 rounded focus:ring-red-500 focus:ring-2 flex-shrink-0"
                    required
                  />
                  <label
                    htmlFor="acceptedTerms"
                    className="text-xs text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-red-400 hover:text-red-300 transition-colors duration-300 underline font-semibold"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-red-400 hover:text-red-300 transition-colors duration-300 underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl 
                           font-semibold text-sm transition-all duration-300 transform hover:scale-105 
                           hover:shadow-2xl hover:shadow-red-900/30 border border-red-500/30 relative overflow-hidden group
                           ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:from-red-500 hover:to-red-600"}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Host Account...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">
                      Create Host Account 🚀
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </>
                )}
              </button>

              {/* Updated Sign In Link */}
              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-red-400 hover:text-red-300 transition-colors duration-300 font-semibold underline hover:scale-105 transform"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>

          {/* Enhanced Host Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: "🎯",
                title: "Easy Management",
                desc: "Simple event creation and management",
              },
              {
                icon: "💰",
                title: "Earn Money",
                desc: "Monetize your events and skills",
              },
              {
                icon: "👥",
                title: "Reach Audience",
                desc: "Access thousands of attendees",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-sm rounded-xl p-5 border border-red-500/10 hover:border-red-500/20 transition-all duration-300 group hover:scale-105"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <div className="text-white text-sm font-semibold mb-2 group-hover:text-red-300 transition-colors duration-300">
                  {benefit.title}
                </div>
                <div className="text-gray-400 text-xs leading-relaxed">
                  {benefit.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
