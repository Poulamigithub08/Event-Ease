import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Signupguest() {
  const emptyUser = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", interests: "", location: "", phone: "", acceptedTerms: false };
  const [data, setData] = useState(emptyUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      await API.post("/auth/register", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "guest",
      });
      toast.success("🎉 Guest account created! Please sign in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const interests = ["Business & Networking", "Technology & Innovation", "Arts & Culture", "Music & Concerts", "Food & Drink", "Sports & Fitness", "Education & Workshops", "Health & Wellness", "Charity & Fundraising", "Social & Parties"];
  const locations = ["New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Online Events", "Multiple Cities"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }} />
        ))}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-purple-900/30">
                <div className="relative w-6 h-6">
                  <div className="absolute left-0 top-0 w-1.5 h-6 bg-white rounded-full shadow-lg"></div>
                  <div className="absolute left-0 top-0 w-4 h-1.5 bg-white rounded-full shadow-lg"></div>
                  <div className="absolute left-0 top-2 w-3 h-1.5 bg-white rounded-full shadow-lg"></div>
                  <div className="absolute left-0 top-4 w-5 h-1.5 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Event<span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">Ease</span></span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Join Amazing <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">Events</span></h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Discover and attend incredible events in your area and beyond</p>
          </div>

          <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-900/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ label: "First Name *", name: "firstName", type: "text", placeholder: "Enter first name", required: true },
                  { label: "Last Name *", name: "lastName", type: "text", placeholder: "Enter last name", required: true }].map((field) => (
                  <div key={field.name} className="group">
                    <label className="block text-xs font-medium text-gray-300 mb-2">{field.label}</label>
                    <input type={field.type} name={field.name} value={data[field.name]} onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
                      placeholder={field.placeholder} required={field.required} />
                  </div>
                ))}
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-300 mb-2">Email Address *</label>
                <div className="relative">
                  <input type="email" name="email" value={data.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300 pl-10"
                    placeholder="your.email@example.com" required />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <input type="tel" name="phone" value={data.phone} onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300 pl-10"
                      placeholder="+91 98765 43210" />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📞</div>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Your Location</label>
                  <select name="location" value={data.location} onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300 appearance-none">
                    <option value="">Select your location</option>
                    {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-300 mb-2">Event Interests</label>
                <select name="interests" value={data.interests} onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300 appearance-none">
                  <option value="">Select your interests</option>
                  {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
                </select>
                <p className="text-gray-500 text-xs mt-2">We'll recommend events based on your interests</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={data.password} onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300 pl-10 pr-10"
                      placeholder="Min. 6 characters" required />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</div>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400">
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={data.confirmPassword} onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300 pl-10 pr-10"
                      placeholder="Confirm password" required />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</div>
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400">
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-black/30 rounded-xl border border-purple-500/10">
                <input id="acceptedTerms" name="acceptedTerms" type="checkbox" checked={data.acceptedTerms} onChange={handleChange}
                  className="w-5 h-5 mt-0.5 bg-black/40 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 flex-shrink-0" required />
                <label htmlFor="acceptedTerms" className="text-xs text-gray-300">
                  I agree to the <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline font-semibold">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" disabled={isSubmitting}
                className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/30 border border-purple-500/30 relative overflow-hidden group ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:from-purple-500 hover:to-blue-500"}`}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Guest Account...</span>
                  </div>
                ) : <span className="relative z-10">Join EventEase as Guest 🎪</span>}
              </button>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{" "}
                <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-semibold underline">Sign in here</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
