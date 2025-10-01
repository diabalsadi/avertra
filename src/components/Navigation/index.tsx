import Link from "next/link";
import { LogIn, LogOut, BookOpen, HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { signOut } from "next-auth/react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg mr-2 sm:mr-3">
              <span className="text-white font-bold text-sm sm:text-lg">A</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Avertra
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-blue-50 group"
            >
              <HomeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 mr-3" />
              <span className="font-semibold text-lg tracking-wide">Home</span>
            </Link>

            <Link
              href="/blogs"
              className="flex items-center text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-blue-50 group"
            >
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 mr-3" />
              <span className="font-semibold text-lg tracking-wide">Blogs</span>
            </Link>

            {isAuthenticated === false && (
              <Link
                href="/login"
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg tracking-wide"
              >
                <LogIn className="w-5 h-5 mr-3" />
                <span>Login</span>
              </Link>
            )}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg tracking-wide"
                >
                  <span>{user?.firstName}</span>
                </Link>
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                      redirect: true,
                    })
                  }
                  className="flex items-center text-gray-700 hover:text-red-600 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-red-50 group"
                >
                  <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 mr-3" />
                  <span className="font-semibold text-lg tracking-wide">
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-blue-50 group"
              >
                <HomeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 mr-3" />
                <span className="font-semibold text-lg tracking-wide">
                  Home
                </span>
              </Link>

              <Link
                href="/blogs"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-blue-50 group"
              >
                <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 mr-3" />
                <span className="font-semibold text-lg tracking-wide">
                  Blogs
                </span>
              </Link>

              {isAuthenticated == false && (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg tracking-wide mx-4"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
