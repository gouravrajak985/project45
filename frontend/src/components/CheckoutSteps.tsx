import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  step1,
  step2,
  step3,
  step4,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {/* Step 1 */}
        <div className="flex items-center">
          {step1 ? (
            <Link
              to="/login"
              className="text-blue-600 font-medium"
            >
              Sign In
            </Link>
          ) : (
            <span className="text-gray-400">Sign In</span>
          )}
        </div>
        
        <div className="mx-3 text-gray-400">&gt;</div>
        
        {/* Step 2 */}
        <div className="flex items-center">
          {step2 ? (
            <Link
              to="/shipping"
              className="text-blue-600 font-medium"
            >
              Shipping
            </Link>
          ) : (
            <span className="text-gray-400">Shipping</span>
          )}
        </div>
        
        <div className="mx-3 text-gray-400">&gt;</div>
        
        {/* Step 3 */}
        <div className="flex items-center">
          {step3 ? (
            <Link
              to="/payment"
              className="text-blue-600 font-medium"
            >
              Payment
            </Link>
          ) : (
            <span className="text-gray-400">Payment</span>
          )}
        </div>
        
        <div className="mx-3 text-gray-400">&gt;</div>
        
        {/* Step 4 */}
        <div className="flex items-center">
          {step4 ? (
            <Link
              to="/placeorder"
              className="text-blue-600 font-medium"
            >
              Place Order
            </Link>
          ) : (
            <span className="text-gray-400">Place Order</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;