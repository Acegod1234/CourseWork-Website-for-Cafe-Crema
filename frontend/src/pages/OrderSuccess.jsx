import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate('/order');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Order Details</h3>
            <p className="text-gray-600 mb-2">Order ID: #{orderData.orderId}</p>
            <p className="text-gray-600 mb-4">Total Amount: ${orderData.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              You will receive an email confirmation shortly with your order details.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/order')}
              className="w-full bg-amber-700 text-white py-3 rounded-md hover:bg-amber-800 font-semibold"
            >
              Place Another Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}