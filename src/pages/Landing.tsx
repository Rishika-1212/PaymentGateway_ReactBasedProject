
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free Security',
    price: 0,
    features: ['Basic Firewall', 'Limited Monitoring', 'Community Support', '5GB Storage']
  },
  {
    name: 'Professional',
    price: 999,
    features: ['Advanced Firewall', '24/7 Monitoring', 'Priority Support', '50GB Storage', 'Monthly Security Report']
  },
  {
    name: 'Enterprise',
    price: 1500,
    features: ['Custom Security Suite', 'Dedicated Support Team', 'Real-time Monitoring', '100GB Storage', 'Weekly Security Reports', 'Custom Solutions']
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleProceed = () => {
    if (selectedPlan !== null) {
      navigate('/checkout', { state: { plan: plans[selectedPlan] } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Secure Payment Gateway
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Enterprise-Grade Security Solutions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Protect your digital assets with our advanced cybersecurity suite. 
            Industry-leading protection for businesses of all sizes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                relative p-8 rounded-2xl backdrop-blur-sm
                ${selectedPlan === index 
                  ? 'border-2 border-primary bg-card shadow-lg' 
                  : 'border border-border bg-card/50 hover:bg-card/80 transition-colors'}
              `}
              onClick={() => setSelectedPlan(index)}
            >
              {selectedPlan === index && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">
                    Selected
                  </span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <div className="text-3xl font-bold mb-6">
                ${plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`
                  w-full py-2 rounded-lg transition-colors
                  ${selectedPlan === index
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'}
                `}
                onClick={() => setSelectedPlan(index)}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleProceed}
            disabled={selectedPlan === null}
            className={`
              px-8 py-3 rounded-lg text-lg font-medium transition-all transform
              ${selectedPlan !== null
                ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'}
            `}
          >
            Proceed to Checkout
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
