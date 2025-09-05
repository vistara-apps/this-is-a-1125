/**
 * Supabase Service
 * Handles all database operations and user authentication
 */

import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config/api.js'

// Initialize Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

/**
 * User Management
 */
export const userService = {
  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Create or update user profile
  async upsertUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upserting user profile:', error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  // Update user state
  async updateUserState(userId, state) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          state,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user state:', error)
      throw error
    }
  },

  // Update trusted contacts
  async updateTrustedContacts(userId, trustedContacts) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          trusted_contacts: trustedContacts,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating trusted contacts:', error)
      throw error
    }
  }
}

/**
 * Legal Guides Management
 */
export const legalGuidesService = {
  // Get state legal guide
  async getStateLegalGuide(state, language = 'English') {
    try {
      const { data, error } = await supabase
        .from('state_legal_guides')
        .select('*')
        .eq('state', state)
        .eq('language', language)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting state legal guide:', error)
      return null
    }
  },

  // Get all available states
  async getAvailableStates() {
    try {
      const { data, error } = await supabase
        .from('state_legal_guides')
        .select('state')
        .eq('language', 'English')
      
      if (error) throw error
      return [...new Set(data.map(item => item.state))]
    } catch (error) {
      console.error('Error getting available states:', error)
      return []
    }
  }
}

/**
 * Scripts Management
 */
export const scriptsService = {
  // Get scripts by scenario and language
  async getScripts(scenario = null, language = 'English', stateApplicability = null) {
    try {
      let query = supabase
        .from('scripts')
        .select('*')
        .eq('language', language)
      
      if (scenario) {
        query = query.eq('scenario', scenario)
      }
      
      if (stateApplicability) {
        query = query.contains('state_applicability', [stateApplicability])
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting scripts:', error)
      return []
    }
  },

  // Get available scenarios
  async getAvailableScenarios() {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('scenario')
        .eq('language', 'English')
      
      if (error) throw error
      return [...new Set(data.map(item => item.scenario))]
    } catch (error) {
      console.error('Error getting available scenarios:', error)
      return []
    }
  }
}

/**
 * Incident Records Management
 */
export const incidentService = {
  // Create new incident record
  async createIncidentRecord(userId, incidentData) {
    try {
      const { data, error } = await supabase
        .from('incident_records')
        .insert({
          user_id: userId,
          start_time: new Date().toISOString(),
          location: incidentData.location,
          alert_sent_status: false,
          ...incidentData
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating incident record:', error)
      throw error
    }
  },

  // Update incident record
  async updateIncidentRecord(recordId, updateData) {
    try {
      const { data, error } = await supabase
        .from('incident_records')
        .update({
          ...updateData,
          end_time: updateData.endTime || new Date().toISOString()
        })
        .eq('record_id', recordId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating incident record:', error)
      throw error
    }
  },

  // Get user incident records
  async getUserIncidentRecords(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('incident_records')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user incident records:', error)
      return []
    }
  },

  // Delete incident record
  async deleteIncidentRecord(recordId, userId) {
    try {
      const { error } = await supabase
        .from('incident_records')
        .delete()
        .eq('record_id', recordId)
        .eq('user_id', userId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting incident record:', error)
      throw error
    }
  }
}

/**
 * Real-time subscriptions
 */
export const subscriptionService = {
  // Subscribe to user profile changes
  subscribeToUserProfile(userId, callback) {
    return supabase
      .channel('user-profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to incident record changes
  subscribeToIncidentRecords(userId, callback) {
    return supabase
      .channel('incident-record-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incident_records',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

export { supabase }
export default {
  userService,
  legalGuidesService,
  scriptsService,
  incidentService,
  subscriptionService
}
