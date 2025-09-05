import React, { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

const StateSelector = ({ selectedState, onStateChange, userLocation }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Select Your State</h2>
          <p className="text-gray-600 text-sm">
            {userLocation ? 'Auto-detected location' : 'Choose your state for specific guidance'}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <span className={selectedState ? 'text-gray-900' : 'text-gray-500'}>
            {selectedState || 'Choose a state...'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-modal max-h-60 overflow-y-auto z-10">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => {
                  onStateChange(state)
                  setShowDropdown(false)
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                {state}
              </button>
            ))}
          </div>
        )}
      </div>

      {userLocation && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Location detected automatically</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default StateSelector