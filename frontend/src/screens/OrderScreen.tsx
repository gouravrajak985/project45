import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  updateShippingStatus,
} from '../slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ArrowLeft, Download, Truck } from 'lucide-react';

const OrderScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingStatus, setShippingStatus] = useState('Processing');
  
  const dispatch = useDispatch<AppDispatch>();
  
  const { order, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);
  
  const paymentHandler = () => {
    // In a real app, this would integrate with Stripe or PayPal
    if (order) {
      dispatch(
        payOrder({
          id: order._id,
          paymentResult: {
            id: 'PAYMENT_ID',
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: user?.email || '',
          },
        })
      );
    }
  };
  
  const deliverHandler = () => {
    if (order) {
      dispatch(deliverOrder({ id: order._id, trackingNumber }));
    }
  };
  
  const updateShippingStatusHandler = () => {
    if (order) {
      dispatch(
        updateShippingStatus({
          id: order._id,
          shippingStatus,
          trackingNumber,
        })
      );
    }
  };
  
  const isSellerForAnyItem = order?.orderItems.some(
    (item) => item.seller === user?._id
  );
  
  const canUpdateShipping =
    (user?.role === 'seller' && isSellerForAnyItem) ||
    user?.role === 'admin';

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="error">{error}</Message>
  ) : !order ? (
    <Message>Order not found</Message>
  ) : (
    <div>
      <Link to="/orders" className="flex items-center text-blue-600 mb-4 hover:underline">
        <ArrowLeft size={16} className="mr-1" />
        Back to Orders
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">
        Order {order._id}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Shipping</h2>
              <p className="mb-2">
                <strong>Name:</strong> {order.user?.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${order.user?.email}`} className="text-blue-600">
                  {order.user?.email}
                </a>
              </p>
              <p className="mb-4">
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant="warning">
                  Status: {order.shippingStatus}
                  {order.trackingNumber && (
                    <span className="block mt-1">
                      Tracking: {order.trackingNumber}
                    </span>
                  )}
                </Message>
              )}
            </div>
            
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <p className="mb-4">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt!).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant="error">Not Paid</Message>
              )}
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/product/${item.product}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Type: {item.productType}
                          </p>
                          
                          {item.productType === 'Digital' &&
                            order.isPaid && (
                              <a
                                href={item.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
                              >
                                <Download size={14} className="mr-1" />
                                Download
                              </a>
                            )}
                        </div>
                        
                        <div className="text-right">
                          <p>
                            {item.qty} x ${item.price.toFixed(2)} = $
                            {(item.qty * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>
                  ${order.orderItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${(order.totalPrice - order.orderItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {!order.isPaid && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={paymentHandler}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Pay Now
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  (Demo: Click to simulate payment)
                </p>
              </div>
            )}
          </div>
          
          {canUpdateShipping && !order.isDelivered && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Update Shipping</h2>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="trackingNumber"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="shippingStatus"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="shippingStatus"
                    value={shippingStatus}
                    onChange={(e) => setShippingStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={updateShippingStatusHandler}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Truck size={18} className="mr-2" />
                  Update Status
                </button>
                
                {shippingStatus === 'Delivered' && (
                  <button
                    type="button"
                    onClick={deliverHandler}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <Truck size={18} className="mr-2" />
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;