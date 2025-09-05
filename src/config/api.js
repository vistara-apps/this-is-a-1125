/**
 * API Configuration for GuardianShield
 * Centralizes all external API configurations and endpoints
 */

// Supabase Configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
}

// Stripe Configuration
export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-key',
  priceIds: {
    monthly: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    yearly: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_yearly',
  }
}

// OpenAI Configuration (for future AI features)
export const openaiConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: 'https://api.openai.com/v1',
}

// Geolocation API Configuration
export const geolocationConfig = {
  options: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
  }
}

// Emergency Contacts Configuration
export const emergencyConfig = {
  maxTrustedContacts: 5,
  smsGateway: import.meta.env.VITE_SMS_GATEWAY_URL || '',
}

// Recording Configuration
export const recordingConfig = {
  audio: {
    mimeType: 'audio/webm;codecs=opus',
    audioBitsPerSecond: 128000,
  },
  video: {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 2500000,
  },
  maxDuration: 3600000, // 1 hour in milliseconds
}

// State Detection API (mock for now, would use real geocoding service)
export const stateDetectionConfig = {
  apiUrl: 'https://api.geocoding.service.com/v1/reverse',
  apiKey: import.meta.env.VITE_GEOCODING_API_KEY || '',
}

export default {
  supabaseConfig,
  stripeConfig,
  openaiConfig,
  geolocationConfig,
  emergencyConfig,
  recordingConfig,
  stateDetectionConfig,
}
