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
  ShoppingCart, 
  ArrowLeft,
  CreditCard,
  Package,
  Shield,
  Truck,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, cartTotal, cartItemCount } = useCart();

  // Form state - shipping information only
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    district: '', // Changed from 'state' to 'district' for Sri Lanka
    postalCode: '', // Changed from 'zipCode' to 'postalCode'
    country: 'Sri Lanka'
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (status === 'authenticated' && items.length === 0) {
      router.push('/cart');
    }
  }, [status, items.length, router]);

  // Update email when session loads
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  // Enhanced form validation - shipping information only
  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Email validation (enhanced)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 254) {
      newErrors.email = 'Email address is too long';
    }

    // Phone validation (enhanced for Sri Lankan numbers)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const phoneValue = formData.phone.trim();
      
      // Sri Lankan phone validation
      if (phoneValue.startsWith('+94')) {
        // +94 format (international)
        if (phoneDigits.length !== 11 || !phoneDigits.startsWith('94')) {
          newErrors.phone = 'Please enter a valid Sri Lankan phone number (+94 XX XXX XXXX)';
        } else if (!phoneDigits.match(/^94[0-9]{9}$/)) {
          newErrors.phone = 'Please enter a valid Sri Lankan phone number (+94 XX XXX XXXX)';
        }
      } else if (phoneValue.startsWith('0')) {
        // Local format (0XX XXX XXXX)
        if (phoneDigits.length !== 10 || !phoneDigits.match(/^0[0-9]{9}$/)) {
          newErrors.phone = 'Please enter a valid Sri Lankan phone number (0XX XXX XXXX)';
        }
      } else {
        newErrors.phone = 'Phone number must start with 0 or +94';
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Please enter a complete street address';
    } else if (formData.address.trim().length > 100) {
      newErrors.address = 'Street address is too long';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.city.trim())) {
      newErrors.city = 'City name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // District validation (Sri Lankan districts)
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    } else if (formData.district.trim().length < 2) {
      newErrors.district = 'Please enter a valid district';
    }

    // Postal code validation (Sri Lankan format)
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = 'Please enter a valid 5-digit postal code (e.g., 10100)';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Handle input changes with real-time validation - shipping only
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Real-time validation for specific fields
    if (touchedFields[field] || value.length > 0) {
      const fieldErrors = {};
      
      switch (field) {
        case 'email':
          if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            fieldErrors.email = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          if (value) {
            const phoneDigits = value.replace(/\D/g, '');
            const phoneValue = value.trim();
            
            // Sri Lankan phone validation
            if (phoneValue.startsWith('+94')) {
              if (phoneDigits.length > 0 && (phoneDigits.length !== 11 || !phoneDigits.startsWith('94'))) {
                fieldErrors.phone = 'Invalid Sri Lankan phone number (+94 XX XXX XXXX)';
              }
            } else if (phoneValue.startsWith('0')) {
              if (phoneDigits.length > 0 && (phoneDigits.length !== 10 || !phoneDigits.match(/^0[0-9]{9}$/))) {
                fieldErrors.phone = 'Invalid Sri Lankan phone number (0XX XXX XXXX)';
              }
            } else if (phoneValue.length > 0) {
              fieldErrors.phone = 'Phone number must start with 0 or +94';
            }
          }
          break;
        case 'postalCode':
          if (value && !/^\d{5}$/.test(value)) {
            fieldErrors.postalCode = 'Please enter a valid 5-digit postal code';
          }
          break;
      }
      
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  // Format phone input for Sri Lankan numbers
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    
    // Handle different phone number formats
    if (digits.length === 0) return '';
    
    // Handle +94 format (Sri Lankan international)
    if (value.startsWith('+94') || digits.startsWith('94')) {
      if (digits.startsWith('94')) {
        if (digits.length <= 4) return `+94 ${digits.slice(2)}`;
        if (digits.length <= 6) return `+94 ${digits.slice(2, 4)} ${digits.slice(4)}`;
        if (digits.length <= 9) return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
      }
    }
    
    // Handle local format (0XX XXX XXXX)
    if (digits.startsWith('0')) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
    
    // Default for partial input
    return digits;
  };

  // Real-time form validation check
  useEffect(() => {
    const hasAnyInput = Object.values(formData).some(value => value.trim().length > 0);
    if (hasAnyInput) {
      validateForm();
    }
  }, [formData]);
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouchedFields(allFields);
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Save shipping information to localStorage or database
      const shippingData = {
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          address2: formData.address2,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        orderSummary: {
          items: items,
          subtotal: cartTotal.toFixed(2),
          tax: (cartTotal * 0.18).toFixed(2),
          total: (cartTotal * 1.18).toFixed(2),
          shipping: 0.00,
          itemCount: cartItemCount
        }
      };

      // Store shipping data in localStorage for the payment page
      localStorage.setItem('techzone_shipping_data', JSON.stringify(shippingData));
      
      console.log('Shipping data saved:', shippingData);

      // Navigate to payment page
      router.push('/payment');
      
    } catch (error) {
      console.error('Error saving shipping data:', error);
      alert('❌ There was an error saving your information. Please try again.');
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
            <p className="text-white">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
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
            <span className="text-yellow-400 font-medium">Checkout</span>
          </motion.div>

          {/* Header */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-6 py-3 text-base font-black">
              <CreditCard className="w-5 h-5 mr-2" />
              CHECKOUT
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-400 to-white mb-6">
              Complete Your Order
            </h1>
            
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-transparent border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </motion.div>

          {/* Checkout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-yellow-400" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleProceedToPayment}>
                    {/* Personal Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.firstName ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.lastName ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                        className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                        }`}
                        placeholder="071 234 5678 or +94 71 234 5678"
                        maxLength="18"
                      />
                      {errors.phone && (
                        <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-400">
                        Supports Sri Lankan mobile numbers (0XX XXX XXXX or +94 XX XXX XXXX)
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                          errors.address ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                        }`}
                        placeholder="123 Galle Road, Colombo"
                        maxLength="100"
                      />
                      {errors.address && (
                        <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors.address}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={(e) => handleInputChange('address2', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-yellow-400 rounded-lg text-white focus:outline-none transition-colors"
                        placeholder="Floor 2, Unit A, etc."
                        maxLength="50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.city ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="Colombo"
                        />
                        {errors.city && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.city}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          District *
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.district ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                        >
                          <option value="">Select District</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Gampaha">Gampaha</option>
                          <option value="Kalutara">Kalutara</option>
                          <option value="Kandy">Kandy</option>
                          <option value="Matale">Matale</option>
                          <option value="Nuwara Eliya">Nuwara Eliya</option>
                          <option value="Galle">Galle</option>
                          <option value="Matara">Matara</option>
                          <option value="Hambantota">Hambantota</option>
                          <option value="Jaffna">Jaffna</option>
                          <option value="Kilinochchi">Kilinochchi</option>
                          <option value="Mannar">Mannar</option>
                          <option value="Vavuniya">Vavuniya</option>
                          <option value="Mullaitivu">Mullaitivu</option>
                          <option value="Batticaloa">Batticaloa</option>
                          <option value="Ampara">Ampara</option>
                          <option value="Trincomalee">Trincomalee</option>
                          <option value="Kurunegala">Kurunegala</option>
                          <option value="Puttalam">Puttalam</option>
                          <option value="Anuradhapura">Anuradhapura</option>
                          <option value="Polonnaruwa">Polonnaruwa</option>
                          <option value="Badulla">Badulla</option>
                          <option value="Moneragala">Moneragala</option>
                          <option value="Ratnapura">Ratnapura</option>
                          <option value="Kegalle">Kegalle</option>
                        </select>
                        {errors.district && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.district}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white focus:outline-none transition-colors ${
                            errors.postalCode ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-yellow-400'
                          }`}
                          placeholder="10100"
                          maxLength="5"
                        />
                        {errors.postalCode && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.postalCode}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Country
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-yellow-400 rounded-lg text-white focus:outline-none transition-colors"
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="Maldives">Maldives</option>
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="Nepal">Nepal</option>
                          <option value="Bhutan">Bhutan</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-xs text-gray-400">
                      <span className="text-red-400">*</span> Required fields
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Order Items */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-400" />
                    Order Summary ({cartItemCount} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 py-2">
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {item.variant.product.name}
                        </p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        ${(item.variant.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-gray-400 text-sm text-center py-2">
                      ... and {items.length - 3} more items
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>Rs. {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-400" />
                      Shipping
                    </span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>VAT (18%)</span>
                    <span>Rs. {(cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-yellow-400">Rs. {(cartTotal * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={isSubmitting || !isFormValid}
                    className={`w-full font-bold py-3 mt-6 transition-all duration-300 ${
                      isSubmitting || !isFormValid
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-400 hover:bg-yellow-300 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
                  
                  {!isFormValid && Object.keys(errors).length > 0 && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Please fix the errors above to continue</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>SSL Protected</span>
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
