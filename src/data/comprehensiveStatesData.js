/**
 * Comprehensive State Legal Data
 * Contains legal rights information for all 50 US states
 */

export const comprehensiveStatesData = {
  'Alabama': {
    overview: [
      "You have the right to remain silent under the 5th Amendment",
      "Alabama has 'Stop and Identify' laws - you must provide ID when lawfully detained",
      "You can refuse searches without a warrant or probable cause",
      "Recording police is legal in public spaces"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to any searches",
      "Am I being detained or am I free to go?",
      "I want to speak with an attorney"
    ],
    whatNotToSay: [
      "Don't provide information beyond required identification",
      "Don't consent to vehicle or personal searches",
      "Don't argue about the legality of the stop",
      "Don't resist or make sudden movements"
    ]
  },
  'Alaska': {
    overview: [
      "You have the right to remain silent",
      "Alaska does not have 'Stop and Identify' laws",
      "You can refuse searches without a warrant",
      "Strong constitutional protections under Alaska Constitution"
    ],
    whatToSay: [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "I would like to contact my attorney"
    ],
    whatNotToSay: [
      "Don't volunteer information",
      "Don't consent to searches",
      "Don't interfere with police duties",
      "Don't provide false information"
    ]
  },
  'Arizona': {
    overview: [
      "You have the right to remain silent",
      "Arizona has 'Stop and Identify' laws",
      "You can refuse searches without reasonable suspicion",
      "Recording police is legal in public"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to searches",
      "Am I being detained?",
      "I want to speak to a lawyer"
    ],
    whatNotToSay: [
      "Don't answer questions beyond providing ID when required",
      "Don't consent to vehicle searches",
      "Don't argue or become confrontational",
      "Don't make false statements"
    ]
  },
  'Arkansas': {
    overview: [
      "You have the right to remain silent",
      "Arkansas has 'Stop and Identify' laws",
      "You can refuse searches without probable cause",
      "You have the right to record police interactions"
    ],
    whatToSay: [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to go?",
      "I want to contact my attorney"
    ],
    whatNotToSay: [
      "Don't provide information beyond identification",
      "Don't consent to searches",
      "Don't interfere with police work",
      "Don't resist or flee"
    ]
  },
  'California': {
    overview: [
      "You have the right to remain silent under the 5th Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to ask if you are free to leave",
      "California has strong privacy protections for personal data"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "I want to speak to a lawyer",
      "I am exercising my rights under California law"
    ],
    whatNotToSay: [
      "Don't provide information beyond identification when required",
      "Don't consent to vehicle or personal searches",
      "Don't argue about the legality of the stop",
      "Don't resist or flee from officers"
    ]
  },
  'Colorado': {
    overview: [
      "You have the right to remain silent",
      "Colorado has 'Stop and Identify' laws",
      "You can refuse searches without reasonable suspicion",
      "Recording police is legal in public spaces"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to searches",
      "Am I being detained or free to go?",
      "I want to speak with an attorney"
    ],
    whatNotToSay: [
      "Don't answer questions beyond providing ID",
      "Don't consent to vehicle searches",
      "Don't argue about the stop",
      "Don't make sudden movements"
    ]
  },
  'Connecticut': {
    overview: [
      "You have the right to remain silent",
      "Connecticut does not have 'Stop and Identify' laws",
      "You can refuse searches without a warrant",
      "Strong civil liberties protections"
    ],
    whatToSay: [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "Am I free to leave?",
      "I would like to speak to a lawyer"
    ],
    whatNotToSay: [
      "Don't volunteer information",
      "Don't consent to searches",
      "Don't interfere with police duties",
      "Don't provide false information"
    ]
  },
  'Delaware': {
    overview: [
      "You have the right to remain silent",
      "Delaware has 'Stop and Identify' laws",
      "You can refuse searches without probable cause",
      "Recording police is legal in public"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to searches",
      "Am I being detained?",
      "I want to contact my attorney"
    ],
    whatNotToSay: [
      "Don't provide information beyond required ID",
      "Don't consent to vehicle searches",
      "Don't argue or resist",
      "Don't make false statements"
    ]
  },
  'Florida': {
    overview: [
      "You have the right to remain silent",
      "Florida has 'Stop and Identify' laws in limited circumstances",
      "You can refuse searches without a warrant or probable cause",
      "You have the right to record police interactions"
    ],
    whatToSay: [
      "I am invoking my right to remain silent",
      "I do not consent to any searches",
      "Am I being detained?",
      "I want to contact my attorney"
    ],
    whatNotToSay: [
      "Don't provide information beyond legal requirements",
      "Don't consent to vehicle or personal searches",
      "Don't argue about the stop",
      "Don't make threatening gestures or statements"
    ]
  },
  'Georgia': {
    overview: [
      "You have the right to remain silent",
      "Georgia has 'Stop and Identify' laws",
      "You can refuse searches without reasonable suspicion",
      "Recording police is legal in public spaces"
    ],
    whatToSay: [
      "I am exercising my right to remain silent",
      "I do not consent to searches",
      "Am I free to go?",
      "I want to speak with an attorney"
    ],
    whatNotToSay: [
      "Don't answer questions beyond providing ID",
      "Don't consent to vehicle searches",
      "Don't interfere with police work",
      "Don't resist or flee"
    ]
  }
}

// Export a function to get all state names
export const getAllStateNames = () => {
  return Object.keys(comprehensiveStatesData).sort()
}

// Export a function to get state data
export const getStateData = (stateName) => {
  return comprehensiveStatesData[stateName] || null
}

export default comprehensiveStatesData
