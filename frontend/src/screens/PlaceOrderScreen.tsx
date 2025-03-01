import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createOrder, clearOrder } from '../slices/orderSlice';
import { clearCart } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { ShoppingBag } from 'lucide-react';

const PlaceOrderScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;
  
  const { order, success, error, loading } = useSelector(
    (state: RootState) => state.order
  );
  
  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );
  
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(clearOrder());
      dispatch(clearCart());
    }
  }, [success, navigate, order, dispatch]);
  
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems.map((item) => ({
          ...item,
          product: item.product,
          seller: item.seller,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-2">Shipping</h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {shippingAddress.address},{' '}
                {shippingAddress.city} {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </div>
            
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <p className="text-gray-600">
                <strong>Method:</strong> {paymentMethod}
              </p>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
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
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {error && <Message variant="error">{error}</Message>}
            
            <button
              type="button"
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <ShoppingBag size={18} className="mr-2" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;