# GuardianShield 🛡️

**Your Pocket Guide to Rights & Safety: Know Your Rights. Stay Prepared.**

GuardianShield is a mobile-first web application that provides concise, state-specific legal information and actionable scripts for interactions with law enforcement, empowering users with knowledge and preparedness.

## 🌟 Features

### Core Features

#### 🏛️ State-Specific Rights Guides
- Concise, mobile-optimized summaries of individual rights during law enforcement interactions
- Tailored to the user's current state with accurate, up-to-date legal information
- Clear "what to say" and "what not to say" guidance
- Covers all 50 US states with state-specific nuances

#### 💬 Actionable Scripted Responses
- Pre-written, easy-to-use scripts for common scenarios
- Available in multiple languages (English, Spanish, French)
- Scenario-based responses (traffic stops, searches, detention questions)
- Copy-to-clipboard functionality for quick access

#### 🚨 One-Tap Alert & Recording
- Discreet button to instantly start audio/video recording
- Simultaneous SOS alert with location to pre-selected trusted contacts
- Real-time recording with duration tracking
- Emergency contact quick-call functionality

#### 📋 Shareable Incident Cards
- Generate simple, shareable digital cards with incident details
- Include user rights summary and encounter information
- Quick sharing via messaging, email, or social platforms
- Professional formatting for legal counsel communication

### Premium Features

- 🎥 **Video Recording**: High-quality video recording with audio
- ☁️ **Cloud Backup**: Secure cloud storage for recordings and incident data
- 🌍 **Multi-language Support**: Extended language options for scripts
- 📞 **Advanced Contact Management**: Unlimited trusted contacts
- 📊 **Detailed Analytics**: Incident tracking and reporting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with MediaRecorder API support
- HTTPS connection (required for recording features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-1125.git
   cd this-is-a-1125
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Configuration

Copy `.env.example` to `.env` and configure the following:

```env
# Supabase (Database & Auth)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe (Premium Features)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
VITE_STRIPE_MONTHLY_PRICE_ID=price-id
VITE_STRIPE_YEARLY_PRICE_ID=price-id

# Optional Services
VITE_OPENAI_API_KEY=your-openai-key
VITE_GEOCODING_API_KEY=your-geocoding-key
VITE_SMS_GATEWAY_URL=your-sms-gateway
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Recording**: MediaRecorder API, Web Audio API
- **Location**: Geolocation API
- **Notifications**: Web Notifications API, Web Share API

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── SOSAlert.jsx
│   ├── RightsGuide.jsx
│   ├── Scripts.jsx
│   ├── IncidentLog.jsx
│   ├── TrustedContacts.jsx
│   └── PremiumModal.jsx
├── services/           # API and service layers
│   ├── supabaseService.js
│   ├── recordingService.js
│   ├── geolocationService.js
│   └── notificationService.js
├── data/              # Static data and content
│   ├── statesData.js
│   ├── scriptsData.js
│   └── comprehensiveStatesData.js
├── config/            # Configuration files
│   └── api.js
└── App.jsx           # Main application component
```

### Data Models

#### User
```javascript
{
  userId: UUID,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  state: String,
  preferredLanguages: Array<String>,
  trustedContacts: Array<Object>,
  premiumStatus: Boolean,
  premiumExpiry: Timestamp
}
```

#### Incident Record
```javascript
{
  recordId: UUID,
  userId: ForeignKey,
  startTime: Timestamp,
  endTime: Timestamp,
  recordingUrl: String,
  alertSentStatus: Boolean,
  location: Object
}
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Services

#### Recording Service
Handles audio/video recording with MediaRecorder API:
- Permission management
- Recording start/stop/pause
- Local storage for offline capability
- Format optimization

#### Geolocation Service
Manages location detection and state identification:
- GPS positioning
- State detection from coordinates
- Location formatting and validation
- Privacy-conscious location handling

#### Notification Service
Handles emergency alerts and communications:
- SOS alert generation
- Multi-channel contact notifications (SMS, email, share)
- Local notifications
- Emergency message formatting

#### Supabase Service
Database operations and user management:
- User authentication and profiles
- Legal guides and scripts management
- Incident record CRUD operations
- Real-time subscriptions

## 🔒 Security & Privacy

### Data Protection
- **Local-first approach**: Critical data stored locally when possible
- **Encrypted communications**: All API calls use HTTPS
- **Minimal data collection**: Only essential information is stored
- **User control**: Users can delete their data at any time

### Recording Security
- **Local storage**: Recordings stored locally by default
- **Optional cloud backup**: Premium feature with encryption
- **Automatic cleanup**: Old recordings automatically purged
- **Permission-based**: Requires explicit user consent

### Location Privacy
- **On-demand only**: Location accessed only when needed
- **Approximate positioning**: State-level accuracy sufficient
- **No tracking**: Location not continuously monitored
- **User consent**: Clear permission requests

## 📱 Browser Support

### Required Features
- **MediaRecorder API**: For audio/video recording
- **Geolocation API**: For location detection
- **Web Notifications**: For emergency alerts
- **Local Storage**: For offline functionality

### Supported Browsers
- ✅ Chrome 60+
- ✅ Firefox 70+
- ✅ Safari 14+
- ✅ Edge 80+
- ⚠️ Mobile browsers (iOS Safari 14+, Chrome Mobile 80+)

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

1. **Supabase Setup**
   - Create a new Supabase project
   - Set up authentication
   - Create database tables (see `/docs/database-schema.sql`)
   - Configure RLS policies

2. **Stripe Setup** (for premium features)
   - Create Stripe account
   - Set up products and pricing
   - Configure webhooks

3. **Domain & HTTPS**
   - Deploy to HTTPS-enabled hosting
   - Configure custom domain
   - Set up SSL certificates

### Recommended Hosting
- **Vercel**: Automatic deployments, edge functions
- **Netlify**: Static hosting, form handling
- **AWS Amplify**: Full-stack hosting
- **Firebase Hosting**: Google integration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 Legal Disclaimer

**Important**: GuardianShield provides general legal information and should not be considered legal advice. Laws vary by jurisdiction and change over time. Always consult with a qualified attorney for specific legal situations.

### Limitations
- Information may not reflect recent legal changes
- State laws can vary significantly
- Federal vs. state law differences
- Local ordinances may apply

### Emergency Use
- This app is a tool to assist in emergency situations
- It does not replace proper emergency services (911)
- Recording laws vary by state
- Always prioritize personal safety

## 📞 Support

- **Documentation**: [docs.guardianshield.app](https://docs.guardianshield.app)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/this-is-a-1125/issues)
- **Email**: support@guardianshield.app
- **Community**: [Discord Server](https://discord.gg/guardianshield)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Legal experts** who reviewed our content
- **Civil rights organizations** for guidance
- **Open source community** for tools and libraries
- **Beta testers** for feedback and improvements

---

**GuardianShield** - Empowering citizens with knowledge and preparedness for safer interactions with law enforcement.

*Know Your Rights. Stay Prepared. Stay Safe.*
