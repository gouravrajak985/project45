import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAdminProducts } from '../slices/productSlice';
import { listOrders } from '../slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Users, BarChart2 } from 'lucide-react';
import axios from 'axios';

const AdminDashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: loadingProducts, adminProducts } = useSelector(
    (state: RootState) => state.product
  );
  const { loading: loadingOrders, orders } = useSelector(
    (state: RootState) => state.order
  );
  
  const [totalSales, setTotalSales] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(listOrders());
    
    // Fetch users count
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        
        const { data } = await axios.get(
          'http://localhost:5000/api/users',
          config
        );
        
        setTotalUsers(data.length);
        setLoadingUsers(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [dispatch, user]);
  
  useEffect(() => {
    if (orders.length > 0) {
      // Calculate total sales
      const sales = orders.reduce((acc, order) => {
        if (order.isPaid) {
          return acc + order.totalPrice;
        }
        return acc;
      }, 0);
      setTotalSales(sales);
    }
    
    if (adminProducts.length > 0) {
      // Calculate pending approvals
      const pending = adminProducts.filter(
        (product) => !product.isApproved
      ).length;
      setPendingApprovals(pending);
    }
  }, [orders, adminProducts]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {(loadingProducts || loadingOrders || loadingUsers) ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">{pendingApprovals}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold">{totalUsers}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View All
                </Link>
              </div>
              
              {orders.length === 0 ? (
                <Message>No orders yet</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          USER
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DATE
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600 hover:underline">
                            <Link to={`/order/${order._id}`}>{order._id}</Link>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order.user?.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {!order.isPaid ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Not Paid
                              </span>
                            ) : !order.isDelivered ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {order.shippingStatus}
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Delivered
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Products Pending Approval</h2>
                <Link
                  to="/admin/products"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View All
                </Link>
              </div>
              
              {adminProducts.filter(p => !p.isApproved).length === 0 ? (
                <Message>No products pending approval</Message>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {adminProducts
                    .filter(p => !p.isApproved)
                    .slice(0, 5)
                    .map((product) => (
                      <li key={product._id} className="py-3 flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <Link
                                to={`/admin/product/${product._id}/edit`}
                                className="text-sm font-medium text-blue-600 hover:underline"
                              >
                                {product.title}
                              </Link>
                              <p className="text-sm text-gray-500">
                                by {product.seller?.name || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardScreen;