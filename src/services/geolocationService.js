/**
 * Geolocation Service
 * Handles location detection and state identification
 */

import { geolocationConfig, stateDetectionConfig } from '../config/api.js'

class GeolocationService {
  constructor() {
    this.currentPosition = null
    this.watchId = null
    this.isWatching = false
  }

  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return !!(navigator.geolocation)
  }

  /**
   * Get current position
   */
  async getCurrentPosition(options = {}) {
    try {
      if (!this.isSupported()) {
        throw new Error('Geolocation is not supported by this browser')
      }

      const finalOptions = {
        ...geolocationConfig.options,
        ...options
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentPosition = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            }
            resolve({
              success: true,
              position: this.currentPosition
            })
          },
          (error) => {
            reject({
              success: false,
              error: this.getErrorMessage(error),
              code: error.code
            })
          },
          finalOptions
        )
      })
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Watch position changes
   */
  watchPosition(callback, options = {}) {
    try {
      if (!this.isSupported()) {
        throw new Error('Geolocation is not supported by this browser')
      }

      if (this.isWatching) {
        this.clearWatch()
      }

      const finalOptions = {
        ...geolocationConfig.options,
        ...options
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed
          }
          
          callback({
            success: true,
            position: this.currentPosition
          })
        },
        (error) => {
          callback({
            success: false,
            error: this.getErrorMessage(error),
            code: error.code
          })
        },
        finalOptions
      )

      this.isWatching = true
      return {
        success: true,
        watchId: this.watchId
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Clear position watch
   */
  clearWatch() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
      this.isWatching = false
      return { success: true }
    }
    return { success: false, error: 'No active watch to clear' }
  }

  /**
   * Get error message from GeolocationPositionError
   */
  getErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied by user'
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable'
      case error.TIMEOUT:
        return 'Location request timed out'
      default:
        return 'An unknown error occurred while retrieving location'
    }
  }

  /**
   * Detect state from coordinates using mock data
   * In production, this would use a real geocoding service
   */
  async detectStateFromCoordinates(lat, lon) {
    try {
      // Mock state detection based on approximate coordinate ranges
      const stateRanges = {
        'California': { latMin: 32.5, latMax: 42.0, lonMin: -124.4, lonMax: -114.1 },
        'Texas': { latMin: 25.8, latMax: 36.5, lonMin: -106.6, lonMax: -93.5 },
        'Florida': { latMin: 24.4, latMax: 31.0, lonMin: -87.6, lonMax: -80.0 },
        'New York': { latMin: 40.5, latMax: 45.0, lonMin: -79.8, lonMax: -71.9 },
        'Illinois': { latMin: 36.9, latMax: 42.5, lonMin: -91.5, lonMax: -87.0 },
        'Pennsylvania': { latMin: 39.7, latMax: 42.3, lonMin: -80.5, lonMax: -74.7 },
        'Ohio': { latMin: 38.4, latMax: 41.9, lonMin: -84.8, lonMax: -80.5 },
        'Georgia': { latMin: 30.3, latMax: 35.0, lonMin: -85.6, lonMax: -80.8 },
        'North Carolina': { latMin: 33.8, latMax: 36.6, lonMin: -84.3, lonMax: -75.5 },
        'Michigan': { latMin: 41.7, latMax: 48.2, lonMin: -90.4, lonMax: -82.4 }
      }

      for (const [state, range] of Object.entries(stateRanges)) {
        if (lat >= range.latMin && lat <= range.latMax && 
            lon >= range.lonMin && lon <= range.lonMax) {
          return {
            success: true,
            state,
            confidence: 0.8,
            coordinates: { lat, lon }
          }
        }
      }

      // If no match found, return a default or null
      return {
        success: false,
        error: 'State could not be determined from coordinates',
        coordinates: { lat, lon }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        coordinates: { lat, lon }
      }
    }
  }

  /**
   * Get detailed location information (mock implementation)
   * In production, this would use a real reverse geocoding service
   */
  async reverseGeocode(lat, lon) {
    try {
      // Mock reverse geocoding
      const stateResult = await this.detectStateFromCoordinates(lat, lon)
      
      if (stateResult.success) {
        return {
          success: true,
          location: {
            state: stateResult.state,
            country: 'United States',
            coordinates: { lat, lon },
            formatted: `${stateResult.state}, United States`,
            confidence: stateResult.confidence
          }
        }
      }

      return {
        success: false,
        error: 'Could not reverse geocode coordinates'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    
    return {
      kilometers: distance,
      miles: distance * 0.621371,
      meters: distance * 1000
    }
  }

  /**
   * Convert degrees to radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  /**
   * Get current position if available
   */
  getCurrentCachedPosition() {
    return this.currentPosition
  }

  /**
   * Check if position is recent (within specified minutes)
   */
  isPositionRecent(minutes = 5) {
    if (!this.currentPosition || !this.currentPosition.timestamp) {
      return false
    }
    
    const now = Date.now()
    const positionAge = now - this.currentPosition.timestamp
    const maxAge = minutes * 60 * 1000 // Convert minutes to milliseconds
    
    return positionAge <= maxAge
  }

  /**
   * Get position with fallback to cached if recent
   */
  async getPositionWithFallback(maxCacheAge = 5) {
    try {
      // Try to get fresh position first
      const freshPosition = await this.getCurrentPosition()
      if (freshPosition.success) {
        return freshPosition
      }

      // Fallback to cached position if recent enough
      if (this.isPositionRecent(maxCacheAge)) {
        return {
          success: true,
          position: this.currentPosition,
          cached: true
        }
      }

      // No valid position available
      return {
        success: false,
        error: 'No valid position available'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat, lon, precision = 4) {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    
    return {
      decimal: `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`,
      dms: this.toDMS(lat, lon),
      display: `${Math.abs(lat).toFixed(precision)}°${latDir}, ${Math.abs(lon).toFixed(precision)}°${lonDir}`
    }
  }

  /**
   * Convert decimal degrees to degrees, minutes, seconds
   */
  toDMS(lat, lon) {
    const convertToDMS = (coord) => {
      const absolute = Math.abs(coord)
      const degrees = Math.floor(absolute)
      const minutesFloat = (absolute - degrees) * 60
      const minutes = Math.floor(minutesFloat)
      const seconds = (minutesFloat - minutes) * 60
      
      return { degrees, minutes, seconds: Math.round(seconds * 100) / 100 }
    }

    const latDMS = convertToDMS(lat)
    const lonDMS = convertToDMS(lon)
    
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    
    return {
      latitude: `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds}"${latDir}`,
      longitude: `${lonDMS.degrees}°${lonDMS.minutes}'${lonDMS.seconds}"${lonDir}`
    }
  }
}

// Create singleton instance
const geolocationService = new GeolocationService()

export default geolocationService
export { GeolocationService }
