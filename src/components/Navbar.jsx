import { useEffect, useState } from "react";

import ProfileImage from "../ui/ProfileImage";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../contexts/ThemeProvider";
import logo from "../assets/logo.png";
import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact-us" },
    { name: "About", path: "/about-us" },
  ];
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsProfileDropdownOpen(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 bg-blue-500 dark:bg-blue-600 w-full transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 dark:bg-dark-900/80 shadow-md text-gray-700 dark:text-gray-200 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 ml-0 md:ml-2">
          <img src={logo} alt="logo" className="h-9" />
          <span
            className={`font-bold text-xl ${
              isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"
            }`}
          >
            PayNode
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `group flex flex-col gap-0.5 ${
                  isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"
                } ${isActive ? "font-bold active" : ""}`
              }
            >
              {link.name}
              <div
                className={`${
                  isScrolled ? "bg-gray-700 dark:bg-gray-200" : "bg-white"
                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </NavLink>
          ))}
          {user && (
            <Link to="/dashboard">
              <button
                className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
                  isScrolled
                    ? "text-black dark:text-white border-gray-700 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800"
                    : "text-white border-white hover:bg-white/10"
                } transition-all`}
              >
                Dashboard
              </button>
            </Link>
          )}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <ProfileImage user={user} size={40} />
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  } ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>

                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {theme === "light" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          )}
                        </svg>
                        Theme
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {theme}
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-dark-700 pt-1">
                    <button
                      onClick={handleLogOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-6 w-6 cursor-pointer ${
              isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-dark-900 text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 dark:text-gray-200 transition-all duration-500 z-50 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* User Profile Section for Mobile */}
          {user && (
            <div className="flex flex-col items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-dark-700 w-full max-w-xs">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500">
                <ProfileImage user={user} size={64} />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.displayName || "User"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`${
                location.pathname === link.path
                  ? "font-bold underline underline-offset-4 active text-blue-600"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className="border border-blue-500 text-blue-500 px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => {
                  handleLogOut();
                  setIsMenuOpen(false);
                }}
                className="bg-red-500 text-white px-8 py-2.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-red-600 mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
