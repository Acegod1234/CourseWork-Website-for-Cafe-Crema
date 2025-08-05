import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getTotalItems, getTotalPrice } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = getTotalItems();
  const cartTotal = getTotalPrice();

  return (
    <nav className="bg-gradient-to-r from-white to-amber-50 shadow-xl border-b border-amber-100 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <Link to="/" className="flex items-center space-x-3 lg:space-x-4 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Cafe Crema Logo" 
                  className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover shadow-lg border-2 border-white ring-2 ring-amber-200 group-hover:shadow-xl group-hover:ring-amber-300 transition-all duration-300" 
                />
                <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-amber-500 rounded-full p-1.5 lg:p-2 shadow-md">
                  <svg className="h-3 w-3 lg:h-4 lg:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:to-orange-600 transition-all duration-300">
                  Cafe Crema
                </span>
                <span className="text-xs lg:text-sm text-gray-500 font-medium">Premium Coffee & Dining</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/menu" className="text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 hover:scale-105 relative group text-base xl:text-lg">
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/specials" className="text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 hover:scale-105 relative group text-base xl:text-lg">
              Specials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/order" className="text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 hover:scale-105 relative group text-base xl:text-lg flex items-center space-x-2">
              <span>Order</span>
              {cartItemCount > 0 && (
                <div className="relative">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                </div>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/information" className="text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 hover:scale-105 relative group text-base xl:text-lg">
              Staff
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-bold transition-all duration-300 hover:scale-105 relative group text-base xl:text-lg">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {cartItemCount > 0 && (
              <div className="bg-amber-100 px-3 py-2 rounded-lg border border-amber-200">
                <div className="text-sm font-semibold text-amber-800">
                  Cart: ${cartTotal.toFixed(2)}
                </div>
              </div>
            )}
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-100 to-amber-50 px-4 py-2 rounded-full border border-amber-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name} ({user.role})
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2.5 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2.5 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-amber-700 focus:outline-none focus:text-amber-700 p-2 rounded-lg hover:bg-amber-50 transition-all duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-200 bg-gradient-to-b from-white to-amber-50 rounded-b-2xl shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link 
                to="/menu" 
                className="block px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/specials" 
                className="block px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Specials
              </Link>
              <Link 
                to="/order" 
                className="block px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition-all duration-200 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Order</span>
                {cartItemCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-amber-600 font-medium">${cartTotal.toFixed(2)}</span>
                    <div className="relative">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {cartItemCount}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
              <Link 
                to="/information" 
                className="block px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Staff
              </Link>
              {user && user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="block px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-bold transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* Mobile Auth */}
              <div className="border-t border-amber-200 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-amber-50 rounded-xl mb-3 border border-amber-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{user.name} ({user.role})</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-semibold transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block px-4 py-3 text-gray-700 hover:text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 rounded-xl font-semibold mt-2 transition-all duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 