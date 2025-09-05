/**
 * Recording Service
 * Handles audio/video recording functionality for SOS alerts
 */

import { recordingConfig } from '../config/api.js'

class RecordingService {
  constructor() {
    this.mediaRecorder = null
    this.recordedChunks = []
    this.stream = null
    this.isRecording = false
    this.recordingType = 'audio' // 'audio' or 'video'
    this.startTime = null
    this.maxDuration = recordingConfig.maxDuration
  }

  /**
   * Check if recording is supported
   */
  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
  }

  /**
   * Get available recording constraints
   */
  getConstraints(type = 'audio') {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }

    if (type === 'video') {
      constraints.video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    }

    return constraints
  }

  /**
   * Request media permissions
   */
  async requestPermissions(type = 'audio') {
    try {
      if (!this.isSupported()) {
        throw new Error('Recording not supported in this browser')
      }

      const constraints = this.getConstraints(type)
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.recordingType = type
      
      return {
        success: true,
        stream: this.stream,
        permissions: {
          audio: this.stream.getAudioTracks().length > 0,
          video: this.stream.getVideoTracks().length > 0
        }
      }
    } catch (error) {
      console.error('Error requesting media permissions:', error)
      return {
        success: false,
        error: error.message,
        permissions: { audio: false, video: false }
      }
    }
  }

  /**
   * Start recording
   */
  async startRecording(type = 'audio', options = {}) {
    try {
      if (this.isRecording) {
        throw new Error('Recording already in progress')
      }

      // Request permissions if not already granted
      if (!this.stream) {
        const permissionResult = await this.requestPermissions(type)
        if (!permissionResult.success) {
          throw new Error(permissionResult.error)
        }
      }

      // Configure MediaRecorder
      const mimeType = type === 'video' 
        ? recordingConfig.video.mimeType 
        : recordingConfig.audio.mimeType

      const mediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        ...options
      }

      this.mediaRecorder = new MediaRecorder(this.stream, mediaRecorderOptions)
      this.recordedChunks = []
      this.startTime = Date.now()

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false
      }

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error)
        this.isRecording = false
      }

      // Start recording
      this.mediaRecorder.start(1000) // Collect data every second
      this.isRecording = true

      // Set up auto-stop timer
      if (this.maxDuration > 0) {
        setTimeout(() => {
          if (this.isRecording) {
            this.stopRecording()
          }
        }, this.maxDuration)
      }

      return {
        success: true,
        recordingId: this.startTime,
        type: this.recordingType
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Stop recording
   */
  async stopRecording() {
    try {
      if (!this.isRecording || !this.mediaRecorder) {
        throw new Error('No active recording to stop')
      }

      return new Promise((resolve, reject) => {
        this.mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(this.recordedChunks, {
              type: this.recordingType === 'video' 
                ? recordingConfig.video.mimeType 
                : recordingConfig.audio.mimeType
            })

            const duration = Date.now() - this.startTime
            const url = URL.createObjectURL(blob)

            resolve({
              success: true,
              blob,
              url,
              duration,
              size: blob.size,
              type: this.recordingType,
              recordingId: this.startTime
            })
          } catch (error) {
            reject(error)
          }
        }

        this.mediaRecorder.stop()
        this.isRecording = false
      })
    } catch (error) {
      console.error('Error stopping recording:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Pause recording
   */
  pauseRecording() {
    if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      return { success: true, state: 'paused' }
    }
    return { success: false, error: 'Cannot pause recording' }
  }

  /**
   * Resume recording
   */
  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      return { success: true, state: 'recording' }
    }
    return { success: false, error: 'Cannot resume recording' }
  }

  /**
   * Get recording status
   */
  getStatus() {
    return {
      isRecording: this.isRecording,
      recordingType: this.recordingType,
      duration: this.startTime ? Date.now() - this.startTime : 0,
      state: this.mediaRecorder ? this.mediaRecorder.state : 'inactive',
      chunksCount: this.recordedChunks.length
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    if (this.mediaRecorder) {
      this.mediaRecorder = null
    }

    this.recordedChunks = []
    this.isRecording = false
    this.startTime = null
  }

  /**
   * Save recording to local storage (for offline capability)
   */
  async saveToLocalStorage(recordingData, key) {
    try {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const recordingInfo = {
              data: reader.result,
              timestamp: Date.now(),
              duration: recordingData.duration,
              type: recordingData.type,
              size: recordingData.size
            }
            localStorage.setItem(`recording_${key}`, JSON.stringify(recordingInfo))
            resolve({ success: true, key: `recording_${key}` })
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(recordingData.blob)
      })
    } catch (error) {
      console.error('Error saving recording to local storage:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get recording from local storage
   */
  getFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(`recording_${key}`)
      if (data) {
        return { success: true, data: JSON.parse(data) }
      }
      return { success: false, error: 'Recording not found' }
    } catch (error) {
      console.error('Error getting recording from local storage:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete recording from local storage
   */
  deleteFromLocalStorage(key) {
    try {
      localStorage.removeItem(`recording_${key}`)
      return { success: true }
    } catch (error) {
      console.error('Error deleting recording from local storage:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get all stored recordings
   */
  getAllStoredRecordings() {
    try {
      const recordings = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('recording_')) {
          const data = JSON.parse(localStorage.getItem(key))
          recordings.push({
            key: key.replace('recording_', ''),
            ...data
          })
        }
      }
      return { success: true, recordings }
    } catch (error) {
      console.error('Error getting all stored recordings:', error)
      return { success: false, error: error.message, recordings: [] }
    }
  }
}

// Create singleton instance
const recordingService = new RecordingService()

export default recordingService
export { RecordingService }
