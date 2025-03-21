import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Shield, CheckCircle, Smartphone, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const steps = ['Plan Selection', 'Mobile Verification', 'Payment Details', 'Confirmation'];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi', name: 'UPI Payment', icon: Wallet },
  { id: 'netbanking', name: 'Net Banking', icon: Lock },
];

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const plan = location.state?.plan;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    otp: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    pin: '',
    paymentMethod: 'card'
  });
  const [isVerified, setIsVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState('');

  useEffect(() => {
    if (plan?.price === 0) {
      setCurrentStep(3);
      setTimeout(() => {
        navigate('/success', { state: { plan } });
      }, 1000);
    }
  }, [plan, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    return otp;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'mobileNumber') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 10) return;
    }

    if (name === 'otp' || name === 'pin') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 6) return;
    }

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    }

    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const sendOTP = () => {
    if (formData.mobileNumber.length !== 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    const otp = generateOTP();
    setResendTimer(30);
    setShowOTP(true);
    
    toast({
      title: "OTP Sent",
      description: `Your CyberSen OTP is: ${otp}`,
    });
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      const otp = generateOTP();
      setResendTimer(30);
      toast({
        title: "New OTP Sent",
        description: `Your new CyberSen OTP is: ${otp}`,
      });
    }
  };

  const verifyOTP = () => {
    if (formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    if (formData.otp === generatedOTP) {
      setIsVerified(true);
      setCurrentStep(2);
      toast({
        title: "Verified Successfully",
        description: "Your mobile number has been verified",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect",
        variant: "destructive"
      });
    }
  };

  const validateCard = () => {
    const [month, year] = formData.expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();

    if (expiryDate < currentDate) {
      toast({
        title: "Invalid Card",
        description: "Your card has expired",
        variant: "destructive"
      });
      return false;
    }

    if (formData.pin !== "123456") {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct security PIN",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified && plan?.price !== 0) {
      toast({
        title: "Verification Required",
        description: "Please verify your mobile number first",
        variant: "destructive"
      });
      return;
    }

    if (formData.paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setCurrentStep(3);
    setTimeout(() => {
      navigate('/success', { state: { plan, mobile: formData.mobileNumber } });
    }, 2000);
  };

  const renderPaymentMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {paymentMethods.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: id }))}
          className={`
            flex items-center justify-center p-4 rounded-lg border transition-all
            ${formData.paymentMethod === id 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-border hover:border-primary/50'}
          `}
        >
          <Icon className="w-5 h-5 mr-2" />
          {name}
        </button>
      ))}
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            required
          />
          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          placeholder="John Doe"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleInputChange}
            placeholder="MM/YY"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              required
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Security PIN
        </label>
        <div className="relative">
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            placeholder="Enter 6-digit PIN"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            required
          />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          For demonstration, use PIN: 123456
        </p>
      </div>
    </div>
  );

  const renderUPIForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          UPI ID
        </label>
        <input
          type="text"
          placeholder="username@upi"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          required
        />
      </div>
    </div>
  );

  const renderNetBankingForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Bank
        </label>
        <select className="w-full px-4 py-2 rounded-lg border border-border bg-background">
          <option value="">Select your bank</option>
          <option value="sbi">State Bank of India</option>
          <option value="hdfc">HDFC Bank</option>
          <option value="icici">ICICI Bank</option>
          <option value="axis">Axis Bank</option>
        </select>
      </div>
    </div>
  );

  const renderMobileVerification = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Mobile Verification</h2>
        <p className="text-muted-foreground">
          Please verify your mobile number to proceed
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              required
              disabled={showOTP}
            />
            <Smartphone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {showOTP && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                required
              />
            </div>
            <div className="text-sm text-center">
              {resendTimer > 0 ? (
                <p className="text-muted-foreground">
                  Resend OTP in {resendTimer} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-primary hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={showOTP ? verifyOTP : sendOTP}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {showOTP ? 'Verify OTP' : 'Send OTP'}
        </button>
      </div>

      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <Shield className="w-4 h-4 mr-2" />
        Your number will be used for security verification only
      </div>
    </motion.div>
  );

  if (!plan) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    ${index + 1 < currentStep ? 'bg-primary text-white' :
                      index + 1 === currentStep ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1 < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-20 h-1 mx-2
                      ${index + 1 < currentStep ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            {currentStep === 1 && renderMobileVerification()}
            
            {currentStep === 2 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Payment Details</h2>
                  <p className="text-muted-foreground">
                    Complete your purchase securely
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg mb-8">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-4">
                    <span>{plan.name}</span>
                    <span className="font-semibold">${plan.price}/mo</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${plan.price}/mo</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderPaymentMethods()}
                  
                  {formData.paymentMethod === 'card' && renderCardForm()}
                  {formData.paymentMethod === 'upi' && renderUPIForm()}
                  {formData.paymentMethod === 'netbanking' && renderNetBankingForm()}

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Pay ${plan.price}
                  </button>
                </form>

                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 mr-2" />
                  Secured by industry-leading encryption
                </div>
              </motion.div>
            ) : currentStep === 3 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">Processing Payment</h3>
                <p className="text-muted-foreground">Please wait while we secure your transaction...</p>
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
