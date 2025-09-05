/**
 * Trusted Contacts Component
 * Manages emergency contact information
 */

import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Phone, Mail, User, Save, X, AlertCircle } from 'lucide-react'
import { emergencyConfig } from '../config/api'

const TrustedContacts = ({ 
  contacts = [], 
  onContactsChange, 
  maxContacts = emergencyConfig.maxTrustedContacts 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  })
  const [errors, setErrors] = useState({})

  const relationships = [
    'Family Member',
    'Friend',
    'Spouse/Partner',
    'Parent',
    'Sibling',
    'Colleague',
    'Neighbor',
    'Other'
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const newContact = {
      id: editingContact?.id || Date.now(),
      ...formData,
      phone: formData.phone.replace(/\s+/g, ''), // Remove spaces
      createdAt: editingContact?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedContacts
    if (editingContact) {
      updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id ? newContact : contact
      )
    } else {
      updatedContacts = [...contacts, newContact]
    }

    onContactsChange(updatedContacts)
    resetForm()
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship
    })
    setIsEditing(true)
    setErrors({})
  }

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId)
      onContactsChange(updatedContacts)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: ''
    })
    setEditingContact(null)
    setIsEditing(false)
    setErrors({})
  }

  const formatPhoneNumber = (phone) => {
    // Simple phone number formatting for display
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const canAddMore = contacts.length < maxContacts

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Trusted Contacts</h2>
          <p className="text-sm text-gray-600">
            Add up to {maxContacts} emergency contacts who will receive SOS alerts
          </p>
        </div>
        {canAddMore && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Contact Form */}
      {isEditing && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.relationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingContact ? 'Update Contact' : 'Add Contact'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Trusted Contacts</h3>
            <p className="text-gray-600 mb-4">
              Add emergency contacts to receive SOS alerts when you need help
            </p>
            {canAddMore && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Your First Contact
              </button>
            )}
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Contact Methods */}
                  <div className="flex items-center space-x-2 mr-4">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>{formatPhoneNumber(contact.phone)}</span>
                  {contact.email && <span>{contact.email}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Emergency Alerts Work</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Contacts receive SMS and/or email alerts with your location</li>
              <li>• Alerts include timestamp and incident details</li>
              <li>• Your recording (if available) may be shared with contacts</li>
              <li>• Contacts can call you directly from the alert</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustedContacts
