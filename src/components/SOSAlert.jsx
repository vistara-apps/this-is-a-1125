import React from 'react'
import { AlertTriangle, Square, Phone } from 'lucide-react'

const SOSAlert = ({ onAlert, isRecording, onStopRecording }) => {
  return (
    <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Emergency SOS Alert
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {isRecording 
            ? 'Recording active. Alert sent to your trusted contacts.'
            : 'Instantly start recording and alert your trusted contacts in case of emergency.'
          }
        </p>

        {isRecording ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording in Progress</span>
            </div>
            
            <button
              onClick={onStopRecording}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mx-auto"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onAlert}
            className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🆘 SOS ALERT & RECORD
          </button>
        )}

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Emergency Contacts</span>
          </div>
          <p className="text-gray-500 text-xs">
            Configure trusted contacts in Settings to receive instant alerts
          </p>
        </div>
      </div>
    </div>
  )
}

export default SOSAlert