import React, { useState } from 'react'
import { MessageCircle, Copy, Globe, Lock } from 'lucide-react'

const Scripts = ({ scripts, isPremium, onPremiumRequired }) => {
  const [selectedScenario, setSelectedScenario] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  
  const scenarios = Object.keys(scripts)
  const languages = ['English', 'Spanish', 'French', 'Mandarin']

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Script copied to clipboard!')
    })
  }

  const getScript = () => {
    if (!selectedScenario) return null
    
    const scenarioData = scripts[selectedScenario]
    if (!scenarioData) return null

    // Premium languages require subscription
    if (selectedLanguage !== 'English' && !isPremium) {
      return {
        isPremium: true,
        content: 'Premium feature: Multi-language scripts available with GuardianShield Premium'
      }
    }

    return {
      isPremium: false,
      content: scenarioData[selectedLanguage] || scenarioData.English
    }
  }

  const currentScript = getScript()

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Scripted Responses</h2>
            <p className="text-gray-600 text-sm">Pre-written phrases for common scenarios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a scenario...</option>
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
              {!isPremium && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Premium
                </span>
              )}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                if (e.target.value !== 'English' && !isPremium) {
                  onPremiumRequired()
                  return
                }
                setSelectedLanguage(e.target.value)
              }}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language} {language !== 'English' && !isPremium ? '🔒' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentScript && (
          <div className="space-y-4">
            {currentScript.isPremium ? (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Premium Feature</h3>
                </div>
                <p className="text-purple-700 mb-4">{currentScript.content}</p>
                <button
                  onClick={onPremiumRequired}
                  className="btn-primary"
                >
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Script</h3>
                  <button
                    onClick={() => copyToClipboard(currentScript.content)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentScript.content}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scenarios.slice(0, 4).map((scenario) => (
          <div
            key={scenario}
            className="feature-card cursor-pointer"
            onClick={() => setSelectedScenario(scenario)}
          >
            <h3 className="font-medium text-gray-800 mb-2">{scenario}</h3>
            <p className="text-gray-600 text-sm">
              Quick access to common phrases and responses
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Scripts