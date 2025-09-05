import React from 'react'
import { FileText, Share2, MapPin, Clock } from 'lucide-react'

const IncidentLog = ({ incidents, onShare }) => {
  if (incidents.length === 0) {
    return (
      <div className="card text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Incidents Recorded</h2>
        <p className="text-gray-600">
          Your incident records will appear here when you use the SOS Alert feature.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Incident Log</h2>
            <p className="text-gray-600 text-sm">
              {incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    incident.status === 'active' ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium text-gray-800">
                    Incident #{incident.id.toString().slice(-4)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    incident.status === 'active' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                
                <button
                  onClick={() => onShare(incident)}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Started: {incident.startTime.toLocaleString()}</span>
                </div>
                
                {incident.endTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Ended: {incident.endTime.toLocaleString()}</span>
                  </div>
                )}
                
                {incident.location && (
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Location: {incident.location.lat.toFixed(4)}, {incident.location.lon.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {incident.status === 'completed' && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Duration: {Math.round((incident.endTime - incident.startTime) / 1000 / 60)} minutes
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Share2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Sharing Incident Cards</h3>
            <p className="text-blue-700 text-sm">
              Share incident details with legal counsel, family members, or advocacy organizations. 
              Shared cards include timestamp, location, and relevant rights information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentLog