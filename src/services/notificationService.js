/**
 * Notification Service
 * Handles emergency alerts and trusted contact notifications
 */

import { emergencyConfig } from '../config/api.js'

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window
    this.permission = this.isSupported ? Notification.permission : 'denied'
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    try {
      if (!this.isSupported) {
        return {
          success: false,
          error: 'Notifications not supported in this browser'
        }
      }

      if (this.permission === 'granted') {
        return { success: true, permission: 'granted' }
      }

      const permission = await Notification.requestPermission()
      this.permission = permission

      return {
        success: permission === 'granted',
        permission
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Show local notification
   */
  async showNotification(title, options = {}) {
    try {
      if (!this.isSupported) {
        throw new Error('Notifications not supported')
      }

      if (this.permission !== 'granted') {
        const permissionResult = await this.requestPermission()
        if (!permissionResult.success) {
          throw new Error('Notification permission denied')
        }
      }

      const defaultOptions = {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options
      }

      const notification = new Notification(title, defaultOptions)

      return {
        success: true,
        notification
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send SOS alert to trusted contacts
   */
  async sendSOSAlert(userLocation, trustedContacts, incidentDetails = {}) {
    try {
      const alertData = {
        type: 'SOS_ALERT',
        timestamp: new Date().toISOString(),
        location: userLocation,
        message: this.generateSOSMessage(userLocation, incidentDetails),
        ...incidentDetails
      }

      const results = []

      // Send notifications to each trusted contact
      for (const contact of trustedContacts) {
        try {
          const result = await this.sendContactAlert(contact, alertData)
          results.push({
            contact: contact.name,
            success: result.success,
            method: result.method,
            error: result.error
          })
        } catch (error) {
          results.push({
            contact: contact.name,
            success: false,
            error: error.message
          })
        }
      }

      // Show local notification
      await this.showNotification('SOS Alert Sent', {
        body: `Emergency alert sent to ${trustedContacts.length} trusted contacts`,
        icon: '/emergency-icon.png',
        tag: 'sos-alert'
      })

      return {
        success: true,
        alertId: Date.now(),
        results,
        totalContacts: trustedContacts.length,
        successfulAlerts: results.filter(r => r.success).length
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send alert to individual contact
   */
  async sendContactAlert(contact, alertData) {
    try {
      const methods = []

      // Try SMS first (if available)
      if (contact.phone && this.isSMSAvailable()) {
        try {
          const smsResult = await this.sendSMS(contact.phone, alertData.message)
          if (smsResult.success) {
            methods.push('SMS')
          }
        } catch (error) {
          console.warn('SMS failed for contact:', contact.name, error)
        }
      }

      // Try email (if available)
      if (contact.email && this.isEmailAvailable()) {
        try {
          const emailResult = await this.sendEmail(contact.email, alertData)
          if (emailResult.success) {
            methods.push('Email')
          }
        } catch (error) {
          console.warn('Email failed for contact:', contact.name, error)
        }
      }

      // Fallback to Web Share API or clipboard
      if (methods.length === 0) {
        const shareResult = await this.shareAlert(alertData)
        if (shareResult.success) {
          methods.push('Share')
        }
      }

      return {
        success: methods.length > 0,
        method: methods.join(', '),
        error: methods.length === 0 ? 'No available communication methods' : null
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate SOS message
   */
  generateSOSMessage(location, details = {}) {
    const timestamp = new Date().toLocaleString()
    const locationStr = location 
      ? `Location: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
      : 'Location: Unknown'

    let message = `🚨 EMERGENCY ALERT 🚨\n\n`
    message += `Time: ${timestamp}\n`
    message += `${locationStr}\n\n`
    message += `This is an automated emergency alert from GuardianShield.\n`
    
    if (details.type) {
      message += `Incident Type: ${details.type}\n`
    }
    
    if (details.notes) {
      message += `Notes: ${details.notes}\n`
    }

    message += `\nPlease check on the sender immediately.`
    
    if (location) {
      message += `\n\nGoogle Maps: https://maps.google.com/?q=${location.lat},${location.lon}`
    }

    return message
  }

  /**
   * Check if SMS is available (mock implementation)
   */
  isSMSAvailable() {
    // In a real implementation, this would check for SMS gateway availability
    return !!emergencyConfig.smsGateway
  }

  /**
   * Send SMS (mock implementation)
   */
  async sendSMS(phoneNumber, message) {
    try {
      // Mock SMS sending - in production, this would use a real SMS service
      console.log('Sending SMS to:', phoneNumber, 'Message:', message)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success (in production, this would be a real API call)
      return {
        success: true,
        messageId: `sms_${Date.now()}`,
        provider: 'mock'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Check if email is available
   */
  isEmailAvailable() {
    // Check if mailto is supported
    return true
  }

  /**
   * Send email using mailto
   */
  async sendEmail(email, alertData) {
    try {
      const subject = encodeURIComponent('🚨 Emergency Alert - GuardianShield')
      const body = encodeURIComponent(alertData.message)
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`
      
      // Open mailto link
      window.open(mailtoUrl, '_blank')
      
      return {
        success: true,
        method: 'mailto'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Share alert using Web Share API or fallback to clipboard
   */
  async shareAlert(alertData) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '🚨 Emergency Alert',
          text: alertData.message,
          url: window.location.href
        })
        return { success: true, method: 'webshare' }
      }

      // Fallback to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(alertData.message)
        return { success: true, method: 'clipboard' }
      }

      return { success: false, error: 'No sharing methods available' }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Send incident update to trusted contacts
   */
  async sendIncidentUpdate(incidentId, status, trustedContacts, details = {}) {
    try {
      const updateMessage = this.generateUpdateMessage(incidentId, status, details)
      
      const results = []
      for (const contact of trustedContacts) {
        const result = await this.sendContactUpdate(contact, updateMessage)
        results.push({
          contact: contact.name,
          success: result.success,
          method: result.method
        })
      }

      // Show local notification
      await this.showNotification('Incident Update Sent', {
        body: `Status update sent to ${trustedContacts.length} contacts`,
        tag: 'incident-update'
      })

      return {
        success: true,
        results,
        successfulUpdates: results.filter(r => r.success).length
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate incident update message
   */
  generateUpdateMessage(incidentId, status, details = {}) {
    const timestamp = new Date().toLocaleString()
    
    let message = `📋 Incident Update\n\n`
    message += `Time: ${timestamp}\n`
    message += `Incident ID: ${incidentId}\n`
    message += `Status: ${status.toUpperCase()}\n\n`
    
    if (details.notes) {
      message += `Update: ${details.notes}\n\n`
    }
    
    message += `This is an automated update from GuardianShield.`
    
    return message
  }

  /**
   * Send contact update
   */
  async sendContactUpdate(contact, message) {
    try {
      // Try the same methods as SOS alert but with lower priority
      if (contact.phone && this.isSMSAvailable()) {
        return await this.sendSMS(contact.phone, message)
      }
      
      if (contact.email) {
        return await this.sendEmail(contact.email, { message })
      }
      
      return { success: false, error: 'No available contact methods' }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Schedule periodic check-in notifications
   */
  scheduleCheckIn(intervalMinutes = 30) {
    const intervalMs = intervalMinutes * 60 * 1000
    
    return setInterval(async () => {
      await this.showNotification('Safety Check-in', {
        body: 'Tap to confirm you are safe',
        actions: [
          { action: 'safe', title: 'I am safe' },
          { action: 'help', title: 'Send help' }
        ],
        tag: 'safety-checkin'
      })
    }, intervalMs)
  }

  /**
   * Clear scheduled check-ins
   */
  clearCheckIn(intervalId) {
    if (intervalId) {
      clearInterval(intervalId)
      return { success: true }
    }
    return { success: false, error: 'No interval to clear' }
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus() {
    return {
      supported: this.isSupported,
      permission: this.permission,
      canRequest: this.permission === 'default'
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService
export { NotificationService }
