import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateProfile } from '../slices/authSlice';
import { listMyOrders } from '../slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import { Save, Eye } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const {
    orders,
    loading: loadingOrders,
    error: errorOrders,
  } = useSelector((state: RootState) => state.order);
  
  useEffect(() => {
    if (!user) {
      return;
    }
    
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || '');
    setStoreName(user.storeName || '');
    setStoreDescription(user.storeDescription || '');
    
    dispatch(listMyOrders());
  }, [dispatch, user]);
  
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setMessage(null);
    
    const userData = {
      name,
      email,
      avatar,
      storeName,
      storeDescription,
      ...(password ? { password } : {}),
    };
    
    dispatch(updateProfile(userData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to update profile:', err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Profile</h2>
            
            {message && <Message variant="error">{message}</Message>}
            {error && <Message variant="error">{error}</Message>}
            {successMessage && <Message variant="success">{successMessage}</Message>}
            {loading && <Loader />}
            
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label
                  htmlFor="avatar"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Avatar URL
                </label>
                <input
                  type="text"
                  id="avatar"
                  placeholder="Enter avatar URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {user?.role === 'seller' && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="storeName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      placeholder="Enter store name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label
                      htmlFor="storeDescription"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Store Description
                    </label>
                    <textarea
                      id="storeDescription"
                      placeholder="Enter store description"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Save size={18} className="mr-2" />
                Update
              </button>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">My Orders</h2>
            
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant="error">{errorOrders}</Message>
            ) : orders.length === 0 ? (
              <Message>You have no orders</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DATE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TOTAL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PAID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DELIVERED
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isPaid ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {new Date(order.paidAt!).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isDelivered ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {new Date(order.deliveredAt!).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {order.shippingStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye size={16} className="mr-1" />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;