import React, { useState } from 'react'
import { Shield, AlertCircle, CheckCircle, X } from 'lucide-react'

const RightsGuide = ({ selectedState, stateData }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!selectedState) {
    return (
      <div className="card text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Select a State First</h2>
        <p className="text-gray-600">
          Please select your state to view specific legal rights and guidance.
        </p>
      </div>
    )
  }

  const defaultData = {
    overview: [
      "You have the right to remain silent",
      "You have the right to refuse searches without a warrant",
      "You have the right to ask if you are free to leave",
      "You have the right to an attorney"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "I want to speak to a lawyer"
    ],
    whatNotToSay: [
      "Don't volunteer information",
      "Don't admit guilt or wrongdoing",
      "Don't argue or be confrontational",
      "Don't resist physically"
    ]
  }

  const data = stateData || defaultData

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'whatToSay', label: 'What to Say', icon: CheckCircle },
    { id: 'whatNotToSay', label: 'What NOT to Say', icon: X }
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Rights Guide - {selectedState}</h2>
            <p className="text-gray-600 text-sm">State-specific legal rights and guidance</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          {data[activeTab]?.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                activeTab === 'whatToSay'
                  ? 'bg-green-50 border-green-500'
                  : activeTab === 'whatNotToSay'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <p className="text-gray-800 font-medium">{item}</p>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-8">
              No specific guidance available for this section.
            </p>
          )}
        </div>
      </div>

      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Important Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              Laws vary by jurisdiction and situation. Consult with a qualified attorney for specific legal matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightsGuide