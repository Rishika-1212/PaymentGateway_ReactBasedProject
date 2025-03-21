
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  useEffect(() => {
    if (!plan) {
      navigate('/');
    }
  }, [plan, navigate]);

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-lg p-8 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for choosing our security services. Your protection is our priority.
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-medium mb-4">Order Details</h3>
          <div className="flex justify-between mb-2">
            <span>Plan</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-medium">${plan.price}/mo</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Your security suite is being configured
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
