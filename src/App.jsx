import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import StateSelector from './components/StateSelector'
import RightsGuide from './components/RightsGuide'
import Scripts from './components/Scripts'
import SOSAlert from './components/SOSAlert'
import IncidentLog from './components/IncidentLog'
import PremiumModal from './components/PremiumModal'
import { statesData } from './data/statesData'
import { scriptsData } from './data/scriptsData'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedState, setSelectedState] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [incidents, setIncidents] = useState([])
  const [isRecording, setIsRecording] = useState(false)

  // Auto-detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
          // Simple state detection based on coordinates (mock implementation)
          detectStateFromCoords(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.warn('Location access denied:', error)
        }
      )
    }
  }, [])

  const detectStateFromCoords = (lat, lon) => {
    // Mock state detection - in real app would use reverse geocoding API
    const mockStates = ['California', 'Texas', 'New York', 'Florida']
    const randomState = mockStates[Math.floor(Math.random() * mockStates.length)]
    setSelectedState(randomState)
  }

  const handleSOSAlert = () => {
    if (!isPremium && incidents.length >= 1) {
      setShowPremiumModal(true)
      return
    }

    const newIncident = {
      id: Date.now(),
      startTime: new Date(),
      location: userLocation,
      status: 'active'
    }
    
    setIncidents(prev => [...prev, newIncident])
    setIsRecording(true)
    
    // Mock alert to trusted contacts
    alert('SOS Alert sent to your trusted contacts!')
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIncidents(prev => 
      prev.map(incident => 
        incident.status === 'active' 
          ? { ...incident, endTime: new Date(), status: 'completed' }
          : incident
      )
    )
  }

  const accessPremiumFeature = (feature) => {
    if (!isPremium) {
      setShowPremiumModal(true)
      return false
    }
    return true
  }

  const renderView = () => {
    switch (currentView) {
      case 'rights':
        return (
          <RightsGuide 
            selectedState={selectedState}
            stateData={statesData[selectedState]}
          />
        )
      case 'scripts':
        return (
          <Scripts 
            scripts={scriptsData}
            isPremium={isPremium}
            onPremiumRequired={() => setShowPremiumModal(true)}
          />
        )
      case 'incidents':
        return (
          <IncidentLog 
            incidents={incidents}
            onShare={(incident) => {
              // Mock sharing functionality
              if (navigator.share) {
                navigator.share({
                  title: 'GuardianShield Incident Report',
                  text: `Incident on ${incident.startTime.toLocaleDateString()}`,
                  url: window.location.href
                })
              } else {
                alert('Incident details copied to clipboard!')
              }
            }}
          />
        )
      default:
        return (
          <div className="space-y-6">
            <StateSelector 
              selectedState={selectedState}
              onStateChange={setSelectedState}
              userLocation={userLocation}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                className="feature-card cursor-pointer"
                onClick={() => setCurrentView('rights')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">📋</span>
                  </div>
                  <h3 className="font-semibold text-lg">Your Rights</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {selectedState ? `${selectedState}-specific` : 'State-specific'} legal rights and guidance
                </p>
              </div>

              <div 
                className="feature-card cursor-pointer"
                onClick={() => setCurrentView('scripts')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">💬</span>
                  </div>
                  <h3 className="font-semibold text-lg">Scripts</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Pre-written responses for common scenarios
                </p>
              </div>

              <div 
                className="feature-card cursor-pointer sm:col-span-2 lg:col-span-1"
                onClick={() => setCurrentView('incidents')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">📊</span>
                  </div>
                  <h3 className="font-semibold text-lg">Incidents</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  View and share your incident records
                </p>
              </div>
            </div>

            <SOSAlert 
              onAlert={handleSOSAlert}
              isRecording={isRecording}
              onStopRecording={stopRecording}
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        isPremium={isPremium}
        onPremiumClick={() => setShowPremiumModal(true)}
      />
      
      <main className="max-w-screen-lg mx-auto px-4 py-6">
        {renderView()}
      </main>

      {showPremiumModal && (
        <PremiumModal 
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={() => {
            setIsPremium(true)
            setShowPremiumModal(false)
            alert('Welcome to GuardianShield Premium!')
          }}
        />
      )}
    </div>
  )
}

export default App