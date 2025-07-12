# Scout Challenge Management System - Functional Analysis

## 1. Project Overview

### 1.1 Purpose
The Scout Challenge Management System is a web application designed to facilitate the management of orienteering challenge events for scout groups. The system enables real-time tracking of squad performance, scoring, and leaderboard management for competitive scout events.

### 1.2 Target Users
- **Squads**: Scout groups (2-4 members) participating in challenges
- **Sub-challenge Leaders**: Administrative users who record performances at checkpoints
- **Super Users**: System administrators who manage events, users, and system configuration

### 1.3 Technical Stack
- **Frontend**: Vue.js Progressive Web App (PWA)
- **Backend**: Phoenix API (Elixir)
- **Database**: PostgreSQL
- **Development Environment**: Docker Compose
- **Real-time Updates**: Phoenix Channels/WebSockets

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js PWA    │◄──►│  Phoenix API    │◄──►│   PostgreSQL    │
│   Frontend      │    │   Backend       │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│  Real-time      │
                        │  WebSockets     │
                        └─────────────────┘
```

### 2.2 Docker Compose Services
- **frontend**: Vue.js PWA container
- **backend**: Phoenix API container
- **database**: PostgreSQL container
- **nginx**: Reverse proxy (optional)

## 3. Core Functionalities

### 3.1 User Authentication & Authorization

#### 3.1.1 Individual Scout Registration & Squad Creation
- **Individual Registration Process**:
  - Scout personal information (first name, surname, email, age)
  - Emergency contact information
  - Scout group selection (from event-specific predefined list)
  - Password creation for account access
  - Email confirmation workflow
- **Squad Creation Process**:
  - Squad name and category/age group
  - Member information (2-4 scouts including creator)
  - Scout group assignment (based on creator's group)
  - Draft squad functionality for incomplete registrations
  - Automatic email association for existing squad members
- **Automatic Squad Association**:
  - Email matching logic for existing squad members
  - Automatic association upon first login
  - Notification system for squad leaders
  - Squad member confirmation workflow
- **Login System**:
  - Individual scout login with email/password
  - Session management with JWT tokens
  - Role-based access control (squad member, leader, admin)

#### 3.1.2 Administrative User Management
- **Super User Authentication**:
  - Admin username/password
  - Role-based access control
  - Session management
- **Sub-challenge Leader Authentication**:
  - Leader-specific login
  - Checkpoint assignment
  - Performance recording permissions

### 3.2 Challenge Management

#### 3.2.1 Event Configuration
- **Challenge Setup**:
  - Event name and description
  - Start/end dates and times
  - Checkpoint locations (GPS coordinates)
  - Sub-challenge definitions
  - Scoring rules and weights
- **Checkpoint Management**:
  - Location mapping
  - Sub-challenge types (technical, physical, mental)
  - Point values and time limits
  - Required equipment/materials

#### 3.2.2 Squad Management
- **Squad Registration**:
  - Squad profile creation
  - Member roster management
  - Category assignment
  - Emergency contact information
- **Squad Status Tracking**:
  - Current location
  - Checkpoint progress
  - Time tracking
  - Performance scores

### 3.3 Performance Recording

#### 3.3.1 Sub-challenge Scoring
- **Technical Challenges**:
  - Tree height measurement
  - Rock climbing assessment
  - Navigation accuracy
  - Equipment usage
- **Scoring System**:
  - Point-based scoring (0-100)
  - Time-based bonuses/penalties
  - Difficulty multipliers
  - Bonus points for completion

#### 3.3.2 Time Tracking
- **Checkpoint Timing**:
  - Arrival time recording
  - Departure time recording
  - Sub-challenge completion time
  - Total time at checkpoint
- **Overall Event Timing**:
  - Start time tracking
  - End time calculation
  - Penalty time application

### 3.4 Real-time Leaderboard

#### 3.4.1 Live Updates
- **WebSocket Integration**:
  - Real-time score updates
  - Position changes
  - Checkpoint completions
  - Time updates
- **Leaderboard Display**:
  - Current rankings
  - Score breakdowns
  - Time comparisons
  - Progress indicators

#### 3.4.2 Scoring Algorithm
- **Composite Scoring**:
  - Travel time (40% weight)
  - Sub-challenge scores (40% weight)
  - Checkpoint completion (20% weight)
- **Bonus System**:
  - All checkpoints completed bonus
  - Time efficiency bonuses
  - Technical skill bonuses

## 4. User Interface Design

### 4.1 Squad Interface

#### 4.1.1 Dashboard
- Current position and progress
- Next checkpoint information
- Real-time leaderboard
- Squad performance summary
- Emergency contact information

#### 4.1.2 Challenge Navigation
- Interactive map with checkpoints
- Route optimization suggestions
- Checkpoint details and requirements
- Sub-challenge instructions

### 4.2 Sub-Challenge Leader Interface (Offline-First PWA)

#### 4.2.1 Offline Dashboard
- Squad list for assigned checkpoint
- Search and filter functionality
- Offline/online status indicator
- Sync status and pending uploads
- Recording interface for performances

#### 4.2.2 Performance Recording
- Squad selection from offline database
- Arrival time recording
- Sub-challenge score entry (0-100)
- Departure time recording
- Notes and comments field
- Local save and sync queue management

#### 4.2.3 Sync Management
- Automatic sync when online
- Manual sync trigger
- Conflict resolution interface
- Sync progress indicators
- Failed sync retry mechanism

### 4.3 Finish Line Interface

#### 4.3.1 Finish Line Dashboard
- Squad arrival tracking
- Paper collection status
- Verification progress monitoring
- Final score display
- Real-time leaderboard updates

#### 4.3.2 Paper Verification Interface
- Squad selection and identification
- Expected checkpoint display
- Obliterated paper examination
- Quality assessment controls
- Verification status tracking
- Notes and comments system

#### 4.3.3 Final Performance Recording
- Verified checkpoint completion
- Final score calculation
- Penalty/bonus application
- Performance finalization
- Data reconciliation tools

### 4.4 Administrative Interface

#### 4.3.1 Super User Panel
- Event management dashboard
- Squad registration management
- Checkpoint configuration
- System settings and configuration
- User management (sub-challenge leaders)

#### 4.3.2 Sub-challenge Leader Interface
- Checkpoint-specific dashboard
- Squad arrival/departure recording
- Sub-challenge scoring interface
- Performance notes and comments
- Real-time squad status

### 4.3 Public Leaderboard
- Live ranking display
- Score breakdowns
- Time comparisons
- Progress tracking
- Historical performance data

## 5. Database Schema

### 5.1 Core Entities

#### 5.1.1 Users
```sql
-- Individual scouts and administrative users
users (
  id, email, password_hash, first_name, surname, 
  date_of_birth, emergency_contact, scout_group_id,
  role, email_confirmed, created_at, updated_at
)
```

#### 5.1.2 Scout Groups
```sql
-- Predefined scout groups for events
scout_groups (
  id, name, description, event_id, active,
  created_at, updated_at
)
```

#### 5.1.3 Squads
```sql
-- Scout teams participating in challenges
squads (
  id, name, category, scout_group_id, status,
  created_by_user_id, created_at, updated_at
)
```

#### 5.1.4 Squad Members
```sql
-- Association between users and squads
squad_members (
  id, squad_id, user_id, role, confirmed,
  joined_at, created_at, updated_at
)
```

#### 5.1.4 Events
```sql
-- Challenge events
events (
  id, name, description, start_time, end_time,
  status, created_at, updated_at
)
```

#### 5.1.5 Checkpoints
```sql
-- Orienteering checkpoints
checkpoints (
  id, event_id, name, description, latitude, longitude,
  sub_challenge_type, points_value, time_limit,
  created_at, updated_at
)
```

#### 5.1.6 Squad Performances
```sql
-- Squad performance records
squad_performances (
  id, squad_id, event_id, checkpoint_id,
  arrival_time, departure_time, score,
  notes, recorded_by, created_at, updated_at
)
```

## 6. API Endpoints

### 6.1 Authentication
- `POST /api/auth/register` - Individual scout registration
- `POST /api/auth/login` - User login (scout, admin, leader)
- `POST /api/auth/confirm-email` - Email confirmation
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### 6.2 User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/check-email` - Check email association with squad

### 6.3 Squad Management
- `GET /api/squads` - List squads (filtered by user role)
- `POST /api/squads` - Create new squad
- `GET /api/squads/:id` - Get squad details
- `PUT /api/squads/:id` - Update squad (leader only)
- `DELETE /api/squads/:id` - Delete squad (leader only)
- `POST /api/squads/:id/members` - Add member to squad
- `DELETE /api/squads/:id/members/:user_id` - Remove member from squad
- `PUT /api/squads/:id/members/:user_id/confirm` - Confirm squad membership
- `PUT /api/squads/:id/time-slot` - Assign time slot to squad
- `GET /api/squads/:id/arrival-status` - Get squad arrival status

### 6.4 Arrival Time Management
- `GET /api/arrival-times` - List arrival times for event
- `POST /api/arrival-times` - Create arrival time (admin only)
- `PUT /api/arrival-times/:id` - Update arrival time (admin only)
- `DELETE /api/arrival-times/:id` - Delete arrival time (admin only)
- `GET /api/arrival-times/available` - List available arrival times for squad registration
- `POST /api/arrival-times/generate` - Generate arrival times with interval (admin only)

### 6.5 Squad Validation and Arrival Recording
- `GET /api/squads/expected-arrivals` - List squads with expected arrival times
- `GET /api/squads/:id/validation` - Get squad validation status
- `POST /api/squads/:id/validate` - Validate squad and record arrival
- `PUT /api/squads/:id/validate` - Update squad validation and arrival time
- `GET /api/squads/arrival-statistics` - Get arrival statistics for event

### 6.6 Offline Sub-Challenge Recording
- `GET /api/offline-data` - Download all data for offline use
- `POST /api/offline-recordings` - Upload offline recordings
- `PUT /api/offline-recordings/:id` - Update offline recording
- `GET /api/sync-status` - Check sync status and conflicts
- `POST /api/force-sync` - Manually trigger sync
- `GET /api/checkpoints/:id/offline-data` - Get checkpoint-specific offline data

### 6.7 Finish Line Validation
- `GET /api/finish-line/squads` - List squads for finish line
- `POST /api/finish-line/squads/:id/arrive` - Record squad arrival
- `POST /api/finish-line/squads/:id/collect-papers` - Mark papers collected
- `POST /api/finish-line/squads/:id/verify-papers` - Verify obliterated papers
- `POST /api/finish-line/squads/:id/finalize` - Finalize squad performance
- `GET /api/finish-line/statistics` - Get finish line statistics
- `GET /api/finish-line/leaderboard` - Get final leaderboard

### 6.8 Scout Group Management
- `GET /api/scout-groups` - List scout groups for event
- `POST /api/scout-groups` - Create scout group (admin only)
- `PUT /api/scout-groups/:id` - Update scout group (admin only)
- `DELETE /api/scout-groups/:id` - Delete scout group (admin only)

### 6.3 Event Management
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

### 6.4 Performance Recording
- `POST /api/performances`
- `GET /api/performances/squad/:squad_id`
- `PUT /api/performances/:id`
- `GET /api/performances/checkpoint/:checkpoint_id`

### 6.5 Leaderboard
- `GET /api/leaderboard`
- `GET /api/leaderboard/event/:event_id`
- `GET /api/leaderboard/live`

## 7. Real-time Features

### 7.1 WebSocket Channels
- `leaderboard:lobby` - Live leaderboard updates
- `squad:location` - Squad position tracking
- `checkpoint:updates` - Checkpoint status changes
- `performance:recorded` - New performance records

### 7.2 Real-time Events
- Squad arrival at checkpoint
- Performance score updates
- Leaderboard position changes
- Event status updates

## 8. Security Considerations

### 8.1 Authentication
- JWT token-based authentication
- Role-based access control
- Session management
- Password hashing (bcrypt)

### 8.2 Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### 8.3 API Security
- Rate limiting
- Request validation
- Error handling without information leakage
- HTTPS enforcement

## 9. Development Environment

### 9.1 Docker Compose Setup
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - database
    environment:
      - DATABASE_URL=postgres://user:password@database:5432/challenge_db
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=challenge_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 9.2 Development Workflow
1. **Setup**: `docker-compose up -d`
2. **Database Migration**: `docker-compose exec backend mix ecto.migrate`
3. **Seed Data**: `docker-compose exec backend mix run priv/repo/seeds.exs`
4. **Development**: Hot-reload enabled for both frontend and backend

## 10. Deployment Considerations

### 10.1 Production Environment
- **Frontend**: Static file hosting (Netlify, Vercel, or similar)
- **Backend**: Container deployment (AWS ECS, Google Cloud Run, or similar)
- **Database**: Managed PostgreSQL service
- **Real-time**: WebSocket support in production environment

### 10.2 Monitoring
- Application performance monitoring
- Database performance tracking
- Real-time connection monitoring
- Error tracking and alerting

## 11. Future Enhancements

### 11.1 Advanced Features
- GPS tracking integration
- Photo/video submission for sub-challenges
- Weather integration for outdoor events
- Mobile app development
- Offline capability for remote areas

### 11.2 Analytics
- Performance analytics dashboard
- Historical data analysis
- Predictive scoring models
- Event success metrics

### 11.3 Integration
- Scout organization management systems
- Calendar integration
- Communication platforms
- Emergency services integration

## 12. Success Metrics

### 12.1 Technical Metrics
- Application uptime > 99.9%
- Real-time update latency < 500ms
- Database query performance < 100ms
- Mobile responsiveness score > 90

### 12.2 User Experience Metrics
- User registration completion rate > 95%
- Performance recording accuracy > 99%
- Leaderboard update frequency < 30 seconds
- System usability score > 80

This functional analysis provides a comprehensive foundation for developing the Scout Challenge Management System. The document covers all major aspects of the application while maintaining flexibility for future enhancements and modifications. 