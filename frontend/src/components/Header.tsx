import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../slices/authSlice';
import { Search, ShoppingCart, User, LogOut, Package, LayoutDashboard, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              GumClone
            </Link>
          </div>
          
          <div className="hidden md:block">
            <form onSubmit={submitHandler} className="flex">
              <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-1 text-black rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-3 py-1 rounded-r-md hover:bg-blue-700"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="flex items-center hover:text-blue-300">
              <ShoppingCart size={20} className="mr-1" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center hover:text-blue-300">
                  <User size={20} className="mr-1" />
                  {user.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  
                  {user.role === 'seller' && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/seller/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Products
                      </Link>
                      <Link
                        to="/seller/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Seller Orders
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center hover:text-blue-300">
                <User size={20} className="mr-1" />
                Sign In
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3">
            <form onSubmit={submitHandler} className="flex mb-4">
              <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-1 text-black rounded-l-md focus:outline-none flex-grow"
              />
              <button
                type="submit"
                className="bg-blue-600 px-3 py-1 rounded-r-md hover:bg-blue-700"
              >
                <Search size={18} />
              </button>
            </form>
            
            <div className="flex flex-col space-y-2">
              <Link
                to="/cart"
                className="flex items-center py-2 hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart size={20} className="mr-2" />
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 hover:text-blue-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center py-2 hover:text-blue-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package size={20} className="mr-2" />
                    My Orders
                  </Link>
                  
                  {user.role === 'seller' && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={20} className="mr-2" />
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/seller/products"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package size={20} className="mr-2" />
                        My Products
                      </Link>
                      <Link
                        to="/seller/orders"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package size={20} className="mr-2" />
                        Seller Orders
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={20} className="mr-2" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package size={20} className="mr-2" />
                        Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package size={20} className="mr-2" />
                        Orders
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex items-center py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} className="mr-2" />
                        Users
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      logoutHandler();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center py-2 hover:text-blue-300"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center py-2 hover:text-blue-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;