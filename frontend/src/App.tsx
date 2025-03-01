import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderListScreen from './screens/OrderListScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerDashboardScreen from './screens/SellerDashboardScreen';
import SellerProductListScreen from './screens/SellerProductListScreen';
import SellerOrderListScreen from './screens/SellerOrderListScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-3">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/page/:pageNumber" element={<HomeScreen />} />
            <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
            <Route path="/category/:category" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            
            {/* Private Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orders" element={<OrderListScreen />} />
            </Route>
            
            {/* Seller Routes */}
            <Route path="" element={<SellerRoute />}>
              <Route path="/seller/dashboard" element={<SellerDashboardScreen />} />
              <Route path="/seller/products" element={<SellerProductListScreen />} />
              <Route path="/seller/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/seller/orders" element={<SellerOrderListScreen />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
              <Route path="/admin/products" element={<ProductListScreen />} />
              <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/admin/users" element={<UserListScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route path="/admin/orders" element={<OrderListScreen isAdmin={true} />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;