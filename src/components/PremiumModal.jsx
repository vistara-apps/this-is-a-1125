import React from 'react'
import { X, Crown, Check } from 'lucide-react'

const PremiumModal = ({ onClose, onUpgrade }) => {
  const features = [
    'Multi-language scripts (Spanish, French, Mandarin)',
    'Cloud recording backup and storage',
    'Unlimited incident records',
    'Advanced location sharing',
    'Priority customer support',
    'Legal resource library access'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">GuardianShield Premium</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Unlock advanced features for enhanced safety and legal protection.
            </p>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-800">Monthly Subscription</h3>
                <span className="text-2xl font-bold text-purple-800">$4.99</span>
              </div>
              <p className="text-purple-600 text-sm">per month, cancel anytime</p>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-800">One-time Purchase</h3>
                <span className="text-2xl font-bold text-blue-800">$29.99</span>
              </div>
              <p className="text-blue-600 text-sm">lifetime access, best value</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full btn-primary text-center"
            >
              Upgrade to Premium
            </button>
            
            <button
              onClick={onClose}
              className="w-full btn-secondary text-center"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center mt-4">
            30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PremiumModal