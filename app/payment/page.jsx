"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard,
  ArrowLeft,
  Package,
  Shield,
  CheckCircle,
  AlertCircle,
  Wallet,
  Building,
  Smartphone,
  Loader2,
  Lock,
  DollarSign,
  Zap
} from "lucide-react";

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: {
      address: '',
      city: '',
      state: '',
      postalCode: '', // Changed from zipCode to postalCode for Sri Lankan localization
      country: 'Sri Lanka' // Changed default country to Sri Lanka
    }
  });

  // Order data from shipping page
  const [shippingData, setShippingData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Payment methods
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with your PayPal account',
      popular: false
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Touch ID or Face ID',
      popular: false
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank transfer',
      popular: false
    }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Load shipping data
  useEffect(() => {
    if (status === 'authenticated') {
      const savedShippingData = localStorage.getItem('techzone_shipping_data');
      if (savedShippingData) {
        const data = JSON.parse(savedShippingData);
        setShippingData(data);
        
        // Pre-fill billing address with shipping address
        setPaymentData(prev => ({
          ...prev,
          billingAddress: {
            address: data.shippingAddress.address,
            city: data.shippingAddress.city,
            state: data.shippingAddress.district || data.shippingAddress.state, // Support both field names
            zipCode: data.shippingAddress.postalCode || data.shippingAddress.zipCode, // Support both field names
            country: data.shippingAddress.country
          }
        }));
      } else {
        // No shipping data, redirect back to checkout
        router.push('/checkout');
      }
    }
  }, [status, router]);

  // Validation functions
  const validatePaymentForm = () => {
    const newErrors = {};

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (selectedPaymentMethod === 'credit_card') {
      // Card number validation
      if (!paymentData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else {
        const cardDigits = paymentData.cardNumber.replace(/\D/g, '');
        if (cardDigits.length < 13 || cardDigits.length > 19) {
          newErrors.cardNumber = 'Please enter a valid card number';
        } else if (!isValidCardNumber(cardDigits)) {
          newErrors.cardNumber = 'Please enter a valid card number';
        }
      }

      // Expiry date validation
      if (!paymentData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate.trim())) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      } else {
        const [month, year] = paymentData.expiryDate.split('/');
        const currentDate = new Date();
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiryDate < currentDate) {
          newErrors.expiryDate = 'Card has expired';
        }
      }

      // CVV validation
      if (!paymentData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentData.cvv.trim())) {
        newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
      }

      // Name on card validation
      if (!paymentData.nameOnCard.trim()) {
        newErrors.nameOnCard = 'Name on card is required';
      } else if (paymentData.nameOnCard.trim().length < 2) {
        newErrors.nameOnCard = 'Name on card must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Luhn algorithm for credit card validation
  const isValidCardNumber = (cardNumber) => {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i));
      
      if (alternate) {
        n *= 2;
        if (n > 9) n = (n % 10) + 1;
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  };

  // Format card number
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
    
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Save order to database
  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save order');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        userId: session?.user?.id,
        customerInfo: shippingData.customerInfo,
        shippingAddress: shippingData.shippingAddress,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: selectedPaymentMethod === 'credit_card' ? {
          nameOnCard: paymentData.nameOnCard,
          cardLast4: paymentData.cardNumber.slice(-4),
          // Don't store full card details for security
        } : { method: selectedPaymentMethod },
        items: shippingData.orderSummary.items,
        subtotal: parseFloat(shippingData.orderSummary.subtotal),
        tax: parseFloat(shippingData.orderSummary.tax),
        shipping: parseFloat(shippingData.orderSummary.shipping),
        total: parseFloat(shippingData.orderSummary.total),
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      console.log('Placing order with data:', orderData);

      // Save order to database
      const savedOrder = await saveOrderToDatabase(orderData);
      
      // Clear shipping data from localStorage
      localStorage.removeItem('techzone_shipping_data');
      
      // Show success message and redirect
      alert(`🎉 Order #${savedOrder.id} placed successfully! Thank you for your purchase. You will receive a confirmation email shortly.`);
      
      // Redirect to success page or home
      router.push(`/order-confirmation/${savedOrder.id}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading payment options...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated' || !shippingData) {
    return null; // Will redirect
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-yellow-400/8 blur-3xl animate-pulse-slower" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Breadcrumb */}
          <motion.div 
            className="flex items-center space-x-2 text-sm mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
              Home
            </Link>
            <span className="text-yellow-400">•</span>
            <Link href="/cart" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
              Cart
            </Link>
            <span className="text-yellow-400">•</span>
            <Link href="/checkout" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
              Shipping
            </Link>
            <span className="text-yellow-400">•</span>
            <span className="text-yellow-400 font-medium">Payment</span>
          </motion.div>

          {/* Header */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-6 py-3 text-base font-black">
              <Lock className="w-5 h-5 mr-2" />
              SECURE PAYMENT
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-400 to-white mb-6">
              Complete Payment
            </h1>
            
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-transparent border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shipping
            </Button>
          </motion.div>

          {/* Payment Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Payment Method Selection */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-yellow-400" />
                    Choose Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <method.icon className={`w-6 h-6 ${
                            selectedPaymentMethod === method.id ? 'text-yellow-400' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${
                                selectedPaymentMethod === method.id ? 'text-yellow-400' : 'text-white'
                              }`}>
                                {method.name}
                              </span>
                              {method.popular && (
                                <Badge className="bg-yellow-400/20 text-yellow-400 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === method.id
                            ? 'border-yellow-400 bg-yellow-400'
                            : 'border-gray-400'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="w-3 h-3 text-black ml-0.5 mt-0.5" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {errors.paymentMethod && (
                    <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.paymentMethod}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Credit Card Form */}
              {selectedPaymentMethod === 'credit_card' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-yellow-400" />
                        Card Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.cardNumber ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cardNumber}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={paymentData.nameOnCard}
                          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.nameOnCard ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.nameOnCard && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.nameOnCard}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                              errors.expiryDate ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                            }`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && (
                            <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                              <AlertCircle className="w-3 h-3" />
                              {errors.expiryDate}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                              errors.cvv ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                            }`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && (
                            <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                              <AlertCircle className="w-3 h-3" />
                              {errors.cvv}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-400" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shippingData?.orderSummary?.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 py-2">
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {item.variant?.product?.name || 'Product'}
                        </p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        ${((item.variant?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {shippingData?.orderSummary?.items?.length > 3 && (
                    <p className="text-gray-400 text-sm text-center py-2">
                      ... and {shippingData.orderSummary.items.length - 3} more items
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${shippingData?.orderSummary?.subtotal || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${shippingData?.orderSummary?.tax || '0.00'}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-yellow-400">${shippingData?.orderSummary?.total || '0.00'}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || !selectedPaymentMethod}
                    className={`w-full font-bold py-3 mt-6 transition-all duration-300 ${
                      isSubmitting || !selectedPaymentMethod
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-400 hover:bg-yellow-300 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Complete Order • ${shippingData?.orderSummary?.total || '0.00'}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-green-400" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>Instant Processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
