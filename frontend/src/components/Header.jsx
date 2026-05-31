import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserContext.jsx";
import { toast } from "react-toastify";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, loading: userLoading, setUser } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  navigate("/");
};

  const paths = {
    home: location.pathname === "/",
    events: location.pathname === "/events",
    about: location.pathname === "/about",
    services: location.pathname === "/services",
    gallery: location.pathname === "/gallery",
    blogs: location.pathname === "/blogs",
    contacts: location.pathname === "/contacts",
    myevents: location.pathname === "/myevents",
  };

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsUserMenuOpen(false);
    navigate("/signin");
  };

  if (!user && userLoading) {
    return (
      <div className="flex items-center justify-center">
        Loading...
      </div>
    ); // or a loading spinner
  }
  return (
    <nav
      className={`bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-xl border-b border-red-500/20 sticky top-0 z-50 transition-all duration-500 shadow-2xl shadow-red-900/10 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
      </div>

      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 relative">
        {/* Enhanced Modern Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group relative"
          onClick={closeMenu}
        >
          {/* Animated Logo Container */}
          <div className="relative">
            {/* Main logo shape - Dynamic E Design */}
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center group-hover:from-red-400 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-red-900/30 relative overflow-hidden">
              {/* Animated E shape */}
              <div className="relative w-6 h-6">
                {/* Vertical bar with pulse animation */}
                <div className="absolute left-0 top-0 w-1.5 h-6 bg-white rounded-full shadow-lg animate-pulse-slow"></div>
                {/* Top horizontal bar */}
                <div className="absolute left-0 top-0 w-4 h-1.5 bg-white rounded-full shadow-lg group-hover:w-5 transition-all duration-300"></div>
                {/* Middle horizontal bar */}
                <div className="absolute left-0 top-2 w-3 h-1.5 bg-white rounded-full shadow-lg group-hover:w-4 transition-all duration-300 delay-75"></div>
                {/* Bottom horizontal bar */}
                <div className="absolute left-0 top-4.5 w-5 h-1.5 bg-white rounded-full shadow-lg group-hover:w-6 transition-all duration-300 delay-150"></div>
              </div>

              {/* Enhanced shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Inner glow */}
              <div className="absolute inset-0 bg-red-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Enhanced floating particles */}
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce shadow-lg shadow-yellow-400/50"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-300 shadow-lg shadow-yellow-300/50"></div>
            <div className="absolute -top-1 -left-1 w-1 h-1 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-500"></div>

            {/* Pulsing outer glow */}
            <div className="absolute inset-0 bg-red-400 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 -z-10 group-hover:scale-110 animate-pulse-slow"></div>
          </div>

          {/* Enhanced Logo Text */}
          <div className="flex flex-col">
            <span className="self-center text-2xl font-black whitespace-nowrap text-white group-hover:text-red-100 transition-colors duration-500 tracking-tight">
              Event
              <span className="text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text drop-shadow-lg animate-gradient-x">
                Ease
              </span>
            </span>
            <span className="text-[8px] text-red-400/70 font-medium tracking-widest uppercase -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:delay-300">
              Effortless • Elegant • Exceptional
            </span>
          </div>

          {/* Enhanced animated underline */}
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-400 to-transparent group-hover:w-full transition-all duration-700 rounded-full"></div>

          {/* Background glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
        </Link>

        {/* Enhanced Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-12 h-12 justify-center text-sm text-gray-300 rounded-xl 
                     md:hidden hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 relative group"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <span className="sr-only">Open main menu</span>

          <div className="relative w-6 h-6">
            <span
              className={`absolute left-0 top-1 w-6 h-0.5 bg-red-300 transition-all duration-500 ${
                isMenuOpen
                  ? "rotate-45 top-2 bg-red-400"
                  : "group-hover:bg-red-400"
              } rounded-full`}
            ></span>
            <span
              className={`absolute left-0 top-2 w-6 h-0.5 bg-red-300 transition-all duration-300 ${
                isMenuOpen
                  ? "opacity-0 translate-x-2"
                  : "group-hover:bg-red-400"
              } rounded-full`}
            ></span>
            <span
              className={`absolute left-0 top-3 w-6 h-0.5 bg-red-300 transition-all duration-500 ${
                isMenuOpen
                  ? "-rotate-45 top-2 bg-red-400"
                  : "group-hover:bg-red-400"
              } rounded-full`}
            ></span>
          </div>

          {/* Enhanced button indicators */}
          <div
            className={`absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ${
              isMenuOpen ? "animate-ping" : "opacity-0"
            } transition-opacity duration-300`}
          ></div>
          <div
            className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full ${
              isMenuOpen ? "animate-bounce" : "opacity-0"
            } transition-opacity duration-300 delay-200`}
          ></div>
        </button>

        {/* Enhanced Navigation Menu */}
        <div
          className={`w-full md:block md:w-auto transition-all duration-500 ${
            isMenuOpen ? "block animate-slideDown" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul
            className="font-semibold flex flex-col p-6 md:p-0 mt-4 border border-red-500/20 rounded-2xl 
                         bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-2xl md:bg-transparent md:flex-row md:space-x-2 rtl:space-x-reverse 
                         md:mt-0 md:border-0 md:backdrop-blur-none shadow-2xl md:shadow-none relative overflow-hidden"
          >
            {/* Menu background particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-red-400/20 rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            {[
              { to: "/", label: "HOME", active: paths.home },
              { to: "/events", label: "EVENTS", active: paths.events },
              { to: "/aboutus", label: "ABOUT US", active: paths.about },
              { to: "/services", label: "SERVICES", active: paths.services },
              { to: "/gallery", label: "GALLERY", active: paths.gallery },
              { to: "/blogs", label: "BLOGS", active: paths.blogs },
              { to: "/contactus", label: "CONTACTS", active: paths.contacts },
              { to: "/myevents", label: "MY EVENTS", active: paths.myevents },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={closeMenu}
                  className={`block py-4 px-6 md:py-2 md:px-3 transition-all duration-300 relative group
                    ${
                      item.active
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }
                  `}
                >
                  {/* Enhanced text with gradient effects */}
                  <span
                    className={`relative z-10 font-medium tracking-wide ${
                      item.active
                        ? "text-transparent bg-gradient-to-r from-red-200 to-red-400 bg-clip-text drop-shadow-lg"
                        : "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-100 group-hover:to-red-300 group-hover:bg-clip-text"
                    } transition-all duration-300 flex items-center`}
                  >
                    {item.label}
                    {/* External link indicator for some items */}
                    {["GALLERY", "BLOGS"].includes(item.label) && (
                      <span className="ml-1 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ↗
                      </span>
                    )}
                  </span>

                  {/* Enhanced active underline indicator */}
                  {item.active && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/50"></div>
                  )}

                  {/* Enhanced hover underline animation */}
                  <div
                    className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-400 via-yellow-400 to-red-600 rounded-full transition-all duration-300 group-hover:w-4/5 ${
                      item.active ? "w-4/5" : ""
                    }`}
                  ></div>

                  {/* Hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* User Profile Section */}
        {user ? (
          <div className="relative ml-4">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-black/95 border border-red-500/30 rounded-xl shadow-2xl p-4 z-50">
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>

                <hr className="my-3 border-red-500/20" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ml-4 flex gap-3">
            <Link
              to="/signin"
              className="text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Enhanced Mobile menu backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 backdrop-blur-lg z-40 md:hidden animate-fadeIn"
          onClick={closeMenu}
        >
          {/* Animated particles in backdrop */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-400/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress bar indicator */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-900/20">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-yellow-400 transition-all duration-300"
          style={{
            width: isScrolled ? "100%" : "0%",
            opacity: isScrolled ? 1 : 0,
          }}
        ></div>
      </div>
    </nav>
  );
}
