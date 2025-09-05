import React from 'react'
import { ChevronLeft, Crown, Menu } from 'lucide-react'

const Header = ({ currentView, onViewChange, isPremium, onPremiumClick }) => {
  const getTitle = () => {
    switch (currentView) {
      case 'rights': return 'Your Rights'
      case 'scripts': return 'Scripts'
      case 'incidents': return 'Incident Log'
      default: return 'GuardianShield'
    }
  }

  return (
    <header className="bg-gradient-primary text-white shadow-lg">
      <div className="max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentView !== 'home' && (
              <button
                onClick={() => onViewChange('home')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              {currentView === 'home' && (
                <p className="text-white/80 text-sm">Know Your Rights. Stay Prepared.</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onPremiumClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isPremium 
                  ? 'bg-yellow-500/20 text-yellow-100' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isPremium ? 'Premium' : 'Upgrade'}
              </span>
            </button>
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header