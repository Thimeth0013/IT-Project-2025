import React, { useState } from 'react';

const PaymentGateway = ({ amount =  0 , onPaymentComplete = () => {}, onCancel= () => {} }) => {
  // Payment state
  const [step, setStep] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(amount.toString());
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [customerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');
const [paymentPurpose, setPaymentPurpose] = useState('service');

  // Add validation for customer name and email
const validateCustomerDetails = () => {
  const newErrors = {};
  
  if (!customerName.trim()) {
    newErrors.customerName = 'Please enter your name';
  }
  
  if (!customerEmail.trim()) {
    newErrors.customerEmail = 'Please enter your email';
  } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
    newErrors.customerEmail = 'Please enter a valid email address';
  }
  
  setErrors({...errors, ...newErrors});
  return Object.keys(newErrors).length === 0;
};


  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Determine card type based on number
  const getCardType = (number) => {
    if (number.startsWith('4')) {
      return 'Visa';
    } else if ((parseInt(number.substring(0, 2)) >= 51 && parseInt(number.substring(0, 2)) <= 55) || 
              (parseInt(number.substring(0, 4)) >= 2221 && parseInt(number.substring(0, 4)) <= 2720)) {
      return 'Mastercard';
    } else if (number.substring(0, 2) === '34' || number.substring(0, 2) === '37') {
      return 'American Express';
    } else if (number.startsWith('6')) {
      return 'Discover';
    }
    return '';
  };

  // Validate payment amount
  const validateAmount = () => {
    const newErrors = {};
    
    if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Please enter a valid payment amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate card details
  const validateCardDetails = () => {
    const newErrors = {};
    const cardNumberStripped = cardNumber.replace(/\s/g, '');
    
    if (!cardNumberStripped || cardNumberStripped.length < 13 || cardNumberStripped.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Please enter the cardholder name';
    }
    
    if (!expiryDate || !expiryDate.includes('/') || expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle card number change
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue.substring(0, 19)); // Limit to 19 chars including spaces
  };

  // Handle expiry date change
  const handleExpiryDateChange = (e) => {
    let { value } = e.target;
    
    // Remove any non-digit characters
    value = value.replace(/[^\d]/g, '');
    
    // Format as MM/YY
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    
    setExpiryDate(value);
  };

  // Handle CVV change
  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setCvv(value.substring(0, 4));
  };

  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPaymentAmount(value);
    }
  };

 // Update handleNext function to include customer validation
const handleNext = () => {
  switch (step) {
    case 0:
      if (validateAmount() && validateCustomerDetails()) {
        setStep(1);
      }
      break;
      case 1:
        if (validateCardDetails()) {
          setStep(2);
          processPayment();
        }
        break;
      default:
        break;
  }
};
  // Handle back step
  const handleBack = () => {
    setStep(step - 1);
  };

  // Process payment simulation
// Around line 154, replace the existing processPayment function with this:

// Process payment simulation
const processPayment = async () => {
  setIsProcessing(true);
  
  try {
    // Create a unique transaction ID
    const txnId = `TXN${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    try {
      // Simulate a delay like a real payment processing would take
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Make the API call to your backend - updated to use /api/payments
      const response = await fetch('http://localhost:8000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          transactionId: txnId,
          cardType: getCardType(cardNumber),
          last4: cardNumber.slice(-4),
          status: 'success',
          customerName,
          customerEmail,
          paymentPurpose
        })
      });
      
      if (response.ok) {
        setPaymentStatus('success');
        setTransactionId(txnId);
      } else {
        console.error('Payment API error:', await response.text());
        setPaymentStatus('failed');
      }
    } catch (apiError) {
      console.error('API request error:', apiError);
      setPaymentStatus('failed');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    setPaymentStatus('failed');
  } finally {
    setIsProcessing(false);
  }
};

  // Handle payment completion
  const handleComplete = () => {
    if (onPaymentComplete) {
      onPaymentComplete({
        amount: parseFloat(paymentAmount),
        status: paymentStatus,
        transactionId: transactionId,
        date: new Date().toISOString(),
        last4: cardNumber.slice(-4),
        cardType: getCardType(cardNumber)
      });
    }
  };

  // Step indicators
  const steps = ["Amount", "Payment Details", "Confirmation"];

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        Secure Payment
      </h2>
      
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > index ? 'bg-green-500 text-white' : 
                step === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className={`mt-2 text-sm ${
                step === index ? 'font-semibold text-blue-500' : 'text-gray-500'
              }`}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div className={`absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-500`} 
               style={{ width: `${(step / (steps.length - 1)) * 100}%` }}></div>
        </div>
      </div>
      
      {/* Step 1: Amount */}
      {step === 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Enter Payment Amount</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">Rs.</span>
              <input
                type="text"
                value={paymentAmount}
                onChange={handleAmountChange}
                className={`pl-10 block w-full rounded-md border ${errors.paymentAmount ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
                placeholder="0.00"
              />
            </div>
            {errors.paymentAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentAmount}</p>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Please enter the amount you wish to pay.
          </p>
        </div>
      )}
      
      {/* Step 0: Customer Details */}
      {step === 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Enter Payment Details</h3>
          
          {/* Customer Name field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`block w-full rounded-md border ${errors.customerName ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
              placeholder="John Doe"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
            )}
          </div>
          
          {/* Customer Email field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className={`block w-full rounded-md border ${errors.customerEmail ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
              placeholder="example@email.com"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
            )}
          </div>
          
          {/* Payment Purpose field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Purpose</label>
            <select
              value={paymentPurpose}
              onChange={(e) => setPaymentPurpose(e.target.value)}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2"
            >
              <option value="reservation">Vehicle Reservation</option>
              <option value="service">Vehicle Service</option>
              <option value="repair">Vehicle Repair</option>
              <option value="parts">Parts Purchase</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Please enter your details and the amount you wish to pay.
          </p>
        </div>
      )}
      
      {/* Step 2: Card Details */}
      {step === 1 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          
          {/* Card Preview */}
          <div className="h-48 w-80 mx-auto mb-6 rounded-xl p-6 bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold">Credit Card</span>
              <span className="text-lg font-bold">{getCardType(cardNumber)}</span>
            </div>
            <div className="mb-6">
              <div className="text-xs opacity-75 mb-1">Card Number</div>
              <div className="text-lg tracking-widest">{cardNumber || '•••• •••• •••• ••••'}</div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-xs opacity-75 mb-1">Card Holder</div>
                <div className="text-sm">{cardHolder || 'YOUR NAME'}</div>
              </div>
              <div>
                <div className="text-xs opacity-75 mb-1">Expires</div>
                <div className="text-sm">{expiryDate || 'MM/YY'}</div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 mb-3 mr-3 w-12 h-12 opacity-30">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 8.5C22 6.84 20.16 5.5 18.5 5.5H5.5C3.84 5.5 2 6.84 2 8.5V15.5C2 17.16 3.84 18.5 5.5 18.5H18.5C20.16 18.5 22 17.16 22 15.5V8.5ZM15 15.5H9V14H15V15.5ZM20.5 11.5H3.5V9H20.5V11.5Z"/>
              </svg>
            </div>
          </div>
          
          {/* Card Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`pl-10 block w-full rounded-md border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 font-mono tracking-wider`}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className={`pl-10 block w-full rounded-md border ${errors.cardHolder ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
                  placeholder="John Doe"
                />
              </div>
              {errors.cardHolder && (
                <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className={`block w-full rounded-md border ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={handleCVVChange}
                  className={`block w-full rounded-md border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md flex space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      )}
      
      {/* Step 3: Confirmation */}
      {step === 2 && (
        <div className="mt-6 text-center">
          {isProcessing ? (
            <div className="py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">Processing Your Payment...</p>
              <p className="mt-2 text-sm text-gray-500">Please do not close this window.</p>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your payment of Rs. {parseFloat(paymentAmount).toFixed(2)} has been processed successfully.
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6 mx-auto max-w-sm text-left">
                <p className="text-sm text-gray-600 mb-1">Transaction ID: {transactionId}</p>
                <p className="text-sm text-gray-600">Card: {getCardType(cardNumber)} ending in {cardNumber.slice(-4)}</p>
              </div>
              <button
                onClick={handleComplete}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Complete
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please try again or use a different payment method.
              </p>
              <button
                onClick={() => setStep(1)}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        {step > 0 && step !== 2 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        {step === 0 && (
          <button
          onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        
        {step < 2 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-auto"
          >
            {step === 1 ? 'Pay Now' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;