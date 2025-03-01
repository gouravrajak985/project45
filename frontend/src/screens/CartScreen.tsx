import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { Trash2, ShoppingCart } from 'lucide-react';

const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };
  
  const updateQtyHandler = (product: string, qty: number) => {
    const item = cartItems.find((x) => x.product === product);
    if (item) {
      dispatch(
        addToCart({
          ...item,
          qty,
        })
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Go Back
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 w-24 h-24 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow sm:ml-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <Link
                              to={`/product/${item.product}`}
                              className="text-lg font-medium text-blue-600 hover:underline"
                            >
                              {item.title}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              Type: {item.productType}
                            </p>
                          </div>
                          
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                          <div className="flex items-center">
                            {item.productType === 'Physical' ? (
                              <div className="flex items-center">
                                <span className="mr-2">Qty:</span>
                                <select
                                  value={item.qty}
                                  onChange={(e) =>
                                    updateQtyHandler(
                                      item.product,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="border rounded p-1"
                                >
                                  {[...Array(10).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Digital Product
                              </span>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeFromCartHandler(item.product)}
                            className="mt-2 sm:mt-0 text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                  <span>
                    ${cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>
                      ${cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                <ShoppingCart size={18} className="mr-2" />
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;