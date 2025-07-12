# Scout Challenge Management System - Frontend

A Vue.js Progressive Web Application (PWA) for managing scout orienteering challenges and sub-challenges.

## Features

- **User Authentication**: Login and registration with role-based access
- **Squad Management**: Create and manage scout squads with 2-4 members
- **Event Management**: View and manage orienteering events
- **Leaderboard**: Real-time leaderboard with composite scoring
- **Sub-Challenge Recording**: Offline-capable score recording for sub-challenges
- **Finish Line Validation**: Manual verification of checkpoint completion
- **Admin Panel**: Comprehensive administration interface
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Technology Stack

- **Vue.js 3**: Composition API with modern JavaScript
- **Vuex 4**: State management
- **Vue Router 4**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **PWA**: Progressive Web App capabilities

## Project Structure

```
src/
├── assets/          # Static assets and CSS
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── services/        # API service layer with mocked data
├── store/           # Vuex store modules
├── utils/           # Utility functions
├── views/           # Page components
├── App.vue          # Root component
└── main.js          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run serve
```

3. Build for production:
```bash
npm run build
```

## Mock Data

The application uses mocked API calls for demonstration purposes. Mock data includes:

- **Users**: Admin, Squad Leader, Sub-Challenge Leader
- **Events**: Spring and Summer orienteering challenges
- **Squads**: Eagle Squad, Wolf Pack, Bear Clan
- **Checkpoints**: Starting point, Lake View, Forest Trail, Mountain Peak, Finish Line
- **Leaderboard**: Sample performance data

## Authentication

Use these credentials to test different user roles:

- **Admin**: `admin@scout.com` / any password
- **Squad Leader**: `leader@scout.com` / any password  
- **Sub-Challenge Leader**: `subchallenge@scout.com` / any password

## Key Features

### Squad Registration
- Create squads with 2-4 members
- Select estimated arrival times
- Automatic scout group association

### Sub-Challenge Recording
- Offline-first design
- Record arrival/departure times
- Score sub-challenges (0-100)
- Sync when connection restored

### Finish Line Validation
- Manual checkpoint verification
- Paper condition assessment
- Obliteration quality evaluation
- Final performance recording

### Leaderboard
- Real-time composite scoring
- Checkpoint completion tracking
- Time-based rankings
- Sub-challenge score integration

## Development

### Adding New Features

1. Create service methods in `src/services/`
2. Add Vuex store modules in `src/store/modules/`
3. Create view components in `src/views/`
4. Update router configuration in `src/router/index.js`

### Styling

The application uses Tailwind CSS with custom components defined in `src/assets/css/tailwind.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-success` - Success action buttons
- `.btn-danger` - Danger action buttons
- `.input` - Form input styles
- `.card` - Card container styles

### State Management

Vuex modules:
- `auth` - User authentication and authorization
- `squads` - Squad management
- `events` - Event and checkpoint management
- `leaderboard` - Leaderboard data

## Deployment

The application is configured as a PWA with:

- Service worker for offline functionality
- Manifest file for app installation
- Responsive design for mobile devices

Build the application and deploy to any static hosting service.

## Contributing

1. Follow Vue.js 3 Composition API patterns
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Test offline functionality 