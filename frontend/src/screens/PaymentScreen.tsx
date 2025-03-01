import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard } from 'lucide-react';

const PaymentScreen: React.FC = () => {
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redirect to shipping if shipping address is not set
  if (!shippingAddress.address) {
    navigate('/shipping');
  }
  
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Payment Method</h1>
            
            <form onSubmit={submitHandler}>
              <div className="mb-6">
                <legend className="block text-gray-700 font-medium mb-4">
                  Select Method
                </legend>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="stripe"
                      name="paymentMethod"
                      type="radio"
                      value="Stripe"
                      checked={paymentMethod === 'Stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="stripe"
                      className="ml-3 block text-gray-700"
                    >
                      Stripe
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      value="PayPal"
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="paypal"
                      className="ml-3 block text-gray-700"
                    >
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <CreditCard size={18} className="mr-2" />
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;