import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CreditCardIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const MockCheckout = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const courseName = searchParams.get('name') || 'Course Enrollment';
  const amount = searchParams.get('amount') || '99.99';

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.post('/payments/mock-confirm', { courseId, amount });
      
      // Redirect to Course Details page after success
      navigate(`/course/${courseId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Left Side: Order Summary */}
        <div className="bg-slate-900 text-white p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-8">
              <ShieldCheckIcon className="h-6 w-6" />
              <span className="font-semibold tracking-wide uppercase text-sm">Secure Checkout</span>
            </div>
            
            <h2 className="text-2xl font-light text-slate-300 mb-2">Order Summary</h2>
            <p className="text-xl font-medium mb-10">{courseName}</p>
            
            <div className="space-y-4 text-slate-400">
              <div className="flex justify-between border-b border-slate-700 pb-4">
                <span>Subtotal</span>
                <span className="text-white">${amount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-4">
                <span>Tax</span>
                <span className="text-white">$0.00</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-end mt-10">
            <span className="text-slate-400">Total Due</span>
            <span className="text-4xl font-bold">${amount}</span>
          </div>
        </div>

        {/* Right Side: Mock Payment Form */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Details</h2>
          <p className="text-sm text-slate-500 mb-8 border-l-4 border-indigo-500 pl-4 bg-indigo-50 py-2 rounded-r-lg">
            This is a mock payment gateway. No real credit card is required. Simply click "Process Payment" to simulate a successful transaction.
          </p>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Card Information</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCardIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  disabled
                  className="block w-full pl-10 sm:text-sm border-slate-200 rounded-lg py-3 bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                  value="•••• •••• •••• 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input disabled type="text" value="12/26" className="block w-full sm:text-sm border-slate-200 rounded-lg py-3 bg-slate-100 text-slate-500 text-center cursor-not-allowed" />
                <input disabled type="text" value="123" className="block w-full sm:text-sm border-slate-200 rounded-lg py-3 bg-slate-100 text-slate-500 text-center cursor-not-allowed" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 font-semibold text-lg"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LockClosedIcon className="h-5 w-5" /> Pay ${amount}
                </span>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <LockClosedIcon className="h-3 w-3" /> Payments are processed securely via Stripe.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default MockCheckout;
