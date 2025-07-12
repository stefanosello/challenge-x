# Squad Registration Workflow - User Stories

## Overview
This document describes the detailed registration process for scout squads participating in challenge events. The registration process is designed to be user-friendly while ensuring data accuracy and squad integrity.

## User Story: Individual Scout Registration

### As a scout
I want to register as an individual participant
So that I can join or create a squad for the challenge event

### Acceptance Criteria
- [ ] I can access the registration form from the main application page
- [ ] I can provide my personal information:
  - First name
  - Surname
  - Email address (unique identifier)
  - Age/date of birth
  - Emergency contact information
- [ ] I can select my scout group from a predefined list
- [ ] I can create a password for my account
- [ ] I receive email confirmation of my registration
- [ ] I can log in to the application after registration

### Technical Requirements
- Email validation to ensure uniqueness
- Password strength requirements
- Scout group validation against event configuration
- Email confirmation workflow

## User Story: Squad Creation

### As a registered scout
I want to create a squad for the challenge event
So that my team can participate together

### Acceptance Criteria
- [ ] I can access the squad creation form after logging in
- [ ] I can provide squad information:
  - Squad name
  - Scout group (pre-populated from my registration)
  - Squad category/age group
- [ ] I can add squad members by providing:
  - First name
  - Surname
  - Email address
  - Age/date of birth
- [ ] I can specify my role in the squad (leader, member)
- [ ] I can select an arrival time slot from available options
- [ ] I can save the squad as a draft if not all members are added
- [ ] I can finalize the squad when all members are added
- [ ] I receive confirmation that the squad has been created
- [ ] I receive confirmation of my selected arrival time slot

### Technical Requirements
- Squad size validation (2-4 members)
- Email validation for each squad member
- Automatic scout group assignment based on creator's group
- Draft squad functionality
- Time slot availability checking
- Time slot capacity management

## User Story: Automatic Squad Association

### As a registered scout
I want to be automatically associated with my squad
So that I don't need to manually join if my email is already in a squad

### Acceptance Criteria
- [ ] When I log in for the first time, the system checks if my email exists in any squad
- [ ] If my email is found in a squad, I am automatically associated with that squad
- [ ] I receive a notification that I have been added to the squad
- [ ] I can view my squad details and other members
- [ ] I can access squad-specific features and information

### Technical Requirements
- Email matching logic for squad association
- Notification system for automatic association
- Squad member validation and confirmation

## User Story: Squad Member Management

### As a squad leader
I want to manage my squad members
So that I can ensure all team information is accurate

### Acceptance Criteria
- [ ] I can view all current squad members
- [ ] I can edit squad member information
- [ ] I can remove squad members (with confirmation)
- [ ] I can add new members to the squad
- [ ] I can change squad member roles
- [ ] I can see which members have confirmed their association

### Technical Requirements
- Role-based permissions for squad management
- Confirmation workflow for member removal
- Audit trail for squad changes

## User Story: Time Slot Management

### As a super user
I want to manage arrival time slots for events
So that I can control squad arrival times and prevent overcrowding

### Acceptance Criteria
- [ ] I can create time slots for an event with specific start/end times
- [ ] I can set the duration of each time slot (default 15 minutes)
- [ ] I can set the maximum number of squads per time slot (default 1)
- [ ] I can view all time slots for an event with their availability status
- [ ] I can edit time slot details before the event starts
- [ ] I can cancel time slots if necessary
- [ ] I can see which squads are assigned to each time slot
- [ ] I can view statistics about time slot utilization

### Technical Requirements
- Time slot creation and management
- Automatic capacity tracking
- Conflict prevention for overlapping time slots
- Statistics and reporting capabilities

## User Story: Time Slot Selection

### As a squad leader
I want to select an arrival time slot for my squad
So that we can plan our arrival and avoid conflicts with other squads

### Acceptance Criteria
- [ ] I can view available time slots for the event
- [ ] I can see the start time and duration of each time slot
- [ ] I can see how many squads are already assigned to each time slot
- [ ] I can select an available time slot during squad creation
- [ ] I can change my selected time slot before the event starts
- [ ] I receive confirmation of my time slot selection
- [ ] I receive reminders about my arrival time before the event

### Technical Requirements
- Real-time time slot availability checking
- Time slot capacity management
- Confirmation and reminder system

## User Story: Squad Validation and Arrival Recording

### As a super admin at the starting point
I want to validate squads and record their actual arrival time
So that I can ensure all participants are properly registered and track actual vs estimated arrival times

### Acceptance Criteria
- [ ] I can view all squads expected to arrive with their estimated arrival times
- [ ] I can search for squads by name, squad leader, or scout group
- [ ] I can validate squad information and modify if necessary:
  - Squad name and category
  - Scout group assignment
  - Squad members (add/remove participants)
  - Emergency contact information
- [ ] I can record the actual arrival time when the squad presents
- [ ] I can see if squads arrived on time, early, or late compared to their estimated time
- [ ] I can mark squads as "no-show" if they don't arrive
- [ ] I can view arrival statistics and validation status for the event
- [ ] I can receive notifications when squads are late or missing

### Technical Requirements
- Squad validation and modification interface
- Actual arrival time recording (similar to checkpoint recording)
- Comparison between estimated and actual arrival times
- Late arrival notifications and alerts
- Statistics and reporting capabilities
- Search and filtering functionality

## User Story: Scout Group Management

### As a super user
I want to manage scout groups for events
So that I can control which groups can participate

### Acceptance Criteria
- [ ] I can view all scout groups in the system
- [ ] I can add new scout groups for an event
- [ ] I can edit existing scout group information
- [ ] I can deactivate scout groups
- [ ] I can assign scout groups to specific events
- [ ] I can see statistics about squad registrations per group

### Technical Requirements
- Event-scoped scout group management
- Validation to prevent orphaned scout groups
- Statistics and reporting capabilities

## User Story: Arrival Time Management

### As a super user
I want to define a set of possible arrival times for each event
So that squads can select their unique arrival time during registration

### Acceptance Criteria
- [ ] I can create, edit, and delete arrival times for an event
- [ ] I can set the interval and range for generating arrival times (e.g., every 4 minutes between 8:00 and 9:00)
- [ ] I can see which arrival times are taken and by which squad
- [ ] I can free up an arrival time if a squad cancels or changes their selection
- [ ] I cannot assign the same arrival time to more than one squad

### Technical Requirements
- Arrival times are unique per event
- Each arrival time can be assigned to at most one squad
- Arrival times are managed in a dedicated table

## User Story: Squad Arrival Time Selection

### As a squad leader
I want to select an available arrival time for my squad during registration
So that we have a unique time to present at the event

### Acceptance Criteria
- [ ] I can view a list of available arrival times for my event
- [ ] I can select one available arrival time for my squad
- [ ] Once selected, that arrival time is no longer available to other squads
- [ ] If I change my selection, the previous time becomes available
- [ ] I cannot select an arrival time already taken by another squad
- [ ] I receive confirmation of my selected arrival time

### Technical Requirements
- Arrival time selection is atomic and prevents race conditions
- UI updates available times in real time
- Squad can change their arrival time before the event
- System enforces exclusivity of arrival times

## Registration Flow Diagram

```
Individual Registration
         │
         ▼
    ┌─────────────┐
    │   Register  │
    │  Individual │
    └─────────────┘
         │
         ▼
    ┌─────────────┐
    │    Login    │
    └─────────────┘
         │
         ▼
    ┌─────────────┐
    │ Check Email │
    │Association  │
    └─────────────┘
         │
         ▼
    ┌─────────────┐
    │   Email     │
    │  Found?     │
    └─────────────┘
         │
    ┌────┴────┐
    │   Yes   │    No
    ▼         ▼
┌─────────┐ ┌─────────────┐
│Auto Join│ │Create Squad │
│ Squad   │ │             │
└─────────┘ └─────────────┘
    │             │
    ▼             ▼
┌─────────┐ ┌─────────────┐
│Squad    │ │Add Members  │
│Dashboard│ │             │
└─────────┘ └─────────────┘
    │             │
    ▼             ▼
┌─────────┐ ┌─────────────┐
│Ready for│ │Finalize     │
│Event    │ │Squad        │
└─────────┘ └─────────────┘
```

## Data Flow

### Individual Registration
1. Scout fills out individual registration form
2. System validates email uniqueness
3. System creates user account
4. System sends confirmation email
5. Scout can log in to application

### Squad Creation
1. Registered scout accesses squad creation form
2. Scout provides squad details and member information
3. System validates squad size and member emails
4. System creates squad record
5. System sends invitations to squad members
6. Squad is marked as "draft" until all members confirm

### Automatic Association
1. Scout logs in for the first time
2. System queries database for email in existing squads
3. If found, system associates scout with squad
4. System sends notification to squad leader
5. Scout can access squad dashboard

## Error Handling

### Common Scenarios
- **Email already registered**: Show appropriate message and login option
- **Invalid scout group**: Display error and available groups
- **Squad size exceeded**: Prevent addition of more members
- **Email not found in squad**: Allow manual squad creation
- **Duplicate squad member**: Prevent duplicate entries

### Validation Rules
- Email format validation
- Required field validation
- Squad size limits (2-4 members)
- Age group validation
- Scout group validation against event configuration

## Security Considerations

### Data Protection
- Password hashing using bcrypt
- Email verification for account activation
- Session management with JWT tokens
- Input sanitization and validation

### Privacy
- GDPR compliance for personal data
- Data retention policies
- User consent for data processing
- Right to data deletion

## Integration Points

### Email System
- Registration confirmation emails
- Squad invitation emails
- Password reset emails
- Event reminder emails

### Notification System
- Real-time notifications for squad changes
- Event updates and announcements
- Performance recording notifications

This detailed workflow ensures a smooth and user-friendly registration process while maintaining data integrity and security. 