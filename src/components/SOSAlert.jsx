import React, { useState, useEffect } from 'react'
import { AlertTriangle, Square, Mic, Video, Phone, MapPin, Clock, Users } from 'lucide-react'
import recordingService from '../services/recordingService'
import notificationService from '../services/notificationService'
import geolocationService from '../services/geolocationService'

const SOSAlert = ({ 
  onAlert, 
  isRecording, 
  onStopRecording, 
  trustedContacts = [], 
  userLocation,
  isPremium = false 
}) => {
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingType, setRecordingType] = useState('audio')
  const [alertStatus, setAlertStatus] = useState('ready') // ready, alerting, recording, completed
  const [permissions, setPermissions] = useState({ audio: false, video: false, location: false })

  useEffect(() => {
    // Check permissions on component mount
    checkPermissions()
  }, [])

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingDuration(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const checkPermissions = async () => {
    const audioSupported = recordingService.isSupported()
    const locationSupported = geolocationService.isSupported()
    const notificationSupported = notificationService.getPermissionStatus().supported

    setPermissions({
      audio: audioSupported,
      video: audioSupported,
      location: locationSupported,
      notifications: notificationSupported
    })
  }

  const handleSOSAlert = async () => {
    try {
      setAlertStatus('alerting')
      
      // Get current location if available
      let currentLocation = userLocation
      if (!currentLocation && geolocationService.isSupported()) {
        const locationResult = await geolocationService.getCurrentPosition()
        if (locationResult.success) {
          currentLocation = locationResult.position
        }
      }

      // Send SOS alert to trusted contacts
      if (trustedContacts.length > 0) {
        const alertResult = await notificationService.sendSOSAlert(
          currentLocation,
          trustedContacts,
          {
            type: 'Emergency Alert',
            timestamp: new Date().toISOString(),
            recordingType
          }
        )
        
        if (alertResult.success) {
          console.log(`Alert sent to ${alertResult.successfulAlerts} contacts`)
        }
      }

      // Start recording
      const recordingResult = await recordingService.startRecording(recordingType)
      if (recordingResult.success) {
        setAlertStatus('recording')
        onAlert()
      } else {
        throw new Error(recordingResult.error)
      }
    } catch (error) {
      console.error('SOS Alert failed:', error)
      setAlertStatus('ready')
      alert('Failed to start SOS alert: ' + error.message)
    }
  }

  const handleStopRecording = async () => {
    try {
      const recordingResult = await recordingService.stopRecording()
      if (recordingResult.success) {
        // Save recording locally if premium
        if (isPremium) {
          await recordingService.saveToLocalStorage(recordingResult, Date.now())
        }
        
        setAlertStatus('completed')
        onStopRecording()
        
        // Show completion notification
        await notificationService.showNotification('Recording Saved', {
          body: `${Math.floor(recordingResult.duration / 1000)}s recording saved successfully`,
          tag: 'recording-complete'
        })
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      alert('Failed to stop recording: ' + error.message)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (alertStatus) {
      case 'alerting': return 'bg-yellow-500'
      case 'recording': return 'bg-red-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-red-500'
    }
  }

  const getStatusText = () => {
    switch (alertStatus) {
      case 'alerting': return 'Sending Alert...'
      case 'recording': return 'Recording Active'
      case 'completed': return 'Alert Complete'
      default: return 'Emergency Alert'
    }
  }

  return (
    <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <div className="text-center">
        <div className="mb-4">
          <div className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-3 transition-colors`}>
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{getStatusText()}</h3>
          <p className="text-gray-600 text-sm">
            {!isRecording 
              ? "Tap to start recording and alert your trusted contacts"
              : `Recording ${recordingType} • ${formatDuration(recordingDuration)}`
            }
          </p>
        </div>

        {/* Status Information */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{trustedContacts.length} contacts</span>
          </div>
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{userLocation ? 'Location ready' : 'No location'}</span>
          </div>
        </div>

        {!isRecording ? (
          <div className="space-y-3">
            {/* Recording Type Selector */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setRecordingType('audio')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  recordingType === 'audio'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mic className="w-4 h-4 inline mr-1" />
                Audio
              </button>
              <button
                onClick={() => setRecordingType('video')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  recordingType === 'video'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${!isPremium ? 'opacity-50' : ''}`}
                disabled={!isPremium}
              >
                <Video className="w-4 h-4 inline mr-1" />
                Video {!isPremium && '(Premium)'}
              </button>
            </div>

            <button
              onClick={handleSOSAlert}
              disabled={alertStatus === 'alerting'}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {alertStatus === 'alerting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Alert...</span>
                </>
              ) : (
                <>
                  {recordingType === 'video' ? <Video className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>🆘 SOS ALERT & RECORD</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording {recordingType}</span>
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatDuration(recordingDuration)}</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleStopRecording}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
              
              {trustedContacts.length > 0 && (
                <button 
                  onClick={() => {
                    // Quick call to first trusted contact
                    const firstContact = trustedContacts[0]
                    if (firstContact.phone) {
                      window.open(`tel:${firstContact.phone}`, '_self')
                    }
                  }}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  title="Call first trusted contact"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>Your location and recording will be shared with trusted contacts</p>
          {!permissions.audio && (
            <p className="text-red-500">⚠️ Microphone permission required</p>
          )}
          {recordingType === 'video' && !permissions.video && (
            <p className="text-red-500">⚠️ Camera permission required</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SOSAlert
