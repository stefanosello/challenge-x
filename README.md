# Scout Challenge Management System - Documentation

## Overview
This directory contains comprehensive documentation for the Scout Challenge Management System, a web application designed to facilitate orienteering challenge events for scout groups.

## Documentation Structure

### 📋 [Functional Analysis](./functional_analysis.md)
Complete functional specification including:
- Project overview and technical stack
- System architecture and core functionalities
- User interface design and database schema
- API endpoints and real-time features
- Security considerations and deployment guidelines

### 👥 [User Stories - Registration Workflow](./user-stories/registration-workflow.md)
Detailed user stories for the registration process:
- Individual scout registration
- Squad creation and management
- Automatic squad association
- Scout group management
- Registration flow diagrams and data flow

### 🗄️ [Database Schema](./database-schema/detailed-schema.md)
Complete database design including:
- All tables with relationships and constraints
- Indexes for performance optimization
- Views for common queries
- Triggers for data validation
- Business logic constraints

### 🔧 [API Specifications](./api-specs/)
API documentation and specifications (to be created)

### 🎨 [UI Wireframes](./ui-wireframes/)
User interface wireframes and mockups (to be created)

## Quick Start

### Development Environment
1. **Setup**: `docker-compose up -d`
2. **Database Migration**: `docker-compose exec backend mix ecto.migrate`
3. **Seed Data**: `docker-compose exec backend mix run priv/repo/seeds.exs`
4. **Development**: Hot-reload enabled for both frontend and backend

### Key Features
- **Individual Registration**: Scouts register individually with personal information
- **Squad Creation**: Registered scouts can create or join squads (2-4 members)
- **Automatic Association**: Email-based automatic squad membership
- **Real-time Leaderboard**: Live updates via WebSockets
- **Performance Recording**: Sub-challenge scoring and time tracking
- **Administrative Panel**: Super user and sub-challenge leader interfaces

### Technical Stack
- **Frontend**: Vue.js Progressive Web App (PWA)
- **Backend**: Phoenix API (Elixir)
- **Database**: PostgreSQL
- **Real-time**: Phoenix Channels/WebSockets
- **Development**: Docker Compose

## Documentation Guidelines

### Adding New Documentation
1. Create new files in appropriate subdirectories
2. Update this README with new sections
3. Follow markdown formatting standards
4. Include diagrams and examples where helpful

### Documentation Standards
- Use clear, concise language
- Include code examples where relevant
- Add diagrams for complex workflows
- Maintain consistent formatting
- Update documentation when features change

## Contributing
When adding new features or making changes:
1. Update relevant documentation files
2. Add user stories for new functionality
3. Update API specifications if endpoints change
4. Update database schema if structure changes
5. Create UI wireframes for new interfaces

## Contact
For questions about the documentation or system architecture, please refer to the functional analysis document or create an issue in the project repository. 