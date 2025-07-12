# Offline Sub-Challenge Recording Workflow

## Overview
This document describes the offline-first approach for sub-challenge leaders to record squad performances in remote areas without internet connectivity. The PWA must work completely offline and sync data when connection is restored.

## 🎯 **Core Requirements**

### **Offline-First Architecture:**
- **PWA Installation**: Sub-challenge leaders install the app on their phones
- **Data Pre-download**: All squad and event data downloaded before going offline
- **Offline Recording**: Full functionality without internet connection
- **Data Sync**: Automatic upload when connection is restored
- **Conflict Resolution**: Handle data conflicts when multiple devices sync

## 📱 **PWA Technical Requirements**

### **Service Worker Implementation**
```javascript
// Service Worker for offline functionality
- Cache all static assets (HTML, CSS, JS)
- Cache API responses for offline use
- Handle offline/online state changes
- Queue offline actions for later sync
```

### **IndexedDB Storage**
```javascript
// Local database structure
- squads: All squad information
- events: Event details and checkpoints
- sub_challenges: Sub-challenge definitions
- offline_recordings: Pending sync data
- sync_queue: Actions to sync when online
```

### **Data Synchronization Strategy**
```javascript
// Sync workflow
1. Detect online/offline status
2. Queue offline actions in IndexedDB
3. When online, upload queued data
4. Handle conflicts and merge strategies
5. Update local cache with server data
```

## 📋 **User Stories**

### **User Story: PWA Installation and Setup**

#### As a sub-challenge leader
I want to install the PWA on my phone and download all necessary data
So that I can work offline in remote areas

#### Acceptance Criteria
- [ ] I can install the PWA on my phone from the web browser
- [ ] The app works like a native app (icon, splash screen, full screen)
- [ ] I can log in with my sub-challenge leader credentials
- [ ] The app downloads all squad and event data for offline use
- [ ] I can see download progress and completion status
- [ ] The app works completely offline after initial setup
- [ ] I receive notifications when data sync is needed

#### Technical Requirements
- Progressive Web App with proper manifest
- Service worker for offline functionality
- IndexedDB for local data storage
- Background sync for data upload
- Push notifications for sync status

### **User Story: Offline Squad Performance Recording**

#### As a sub-challenge leader in a remote area
I want to record squad performances without internet connection
So that I can continue working even without connectivity

#### Acceptance Criteria
- [ ] I can view all squads assigned to my checkpoint
- [ ] I can search for squads by name or squad leader
- [ ] I can record arrival time when squad reaches my checkpoint
- [ ] I can record departure time when squad leaves my checkpoint
- [ ] I can record sub-challenge score (0-100 points)
- [ ] I can add notes about the performance
- [ ] All data is saved locally and queued for sync
- [ ] I can see which recordings are pending upload
- [ ] I can edit recordings before they sync

#### Technical Requirements
- Offline-first data entry forms
- Local data validation
- Automatic save to IndexedDB
- Sync queue management
- Conflict detection and resolution

### **User Story: Data Synchronization**

#### As a sub-challenge leader
I want my offline recordings to sync when I have internet connection
So that all data is properly uploaded to the server

#### Acceptance Criteria
- [ ] The app automatically detects when internet connection is restored
- [ ] All offline recordings are uploaded to the server
- [ ] I can see sync progress and completion status
- [ ] I receive confirmation when data is successfully uploaded
- [ ] I can handle sync conflicts if data was modified elsewhere
- [ ] I can manually trigger sync if needed
- [ ] Failed syncs are retried automatically

#### Technical Requirements
- Background sync with service worker
- Conflict resolution strategies
- Retry mechanism for failed uploads
- Progress indicators and status updates
- Manual sync trigger option

### **User Story: Data Pre-download**

#### As a sub-challenge leader
I want to download all necessary data before going offline
So that I have everything I need for offline recording

#### Acceptance Criteria
- [ ] I can trigger a full data download before going offline
- [ ] The app downloads:
  - All squad information and members
  - Event details and checkpoint information
  - Sub-challenge definitions and scoring criteria
  - My assigned checkpoint details
- [ ] I can see download progress and completion
- [ ] I can verify that all data is available offline
- [ ] I can refresh data when online to get updates

#### Technical Requirements
- Bulk data download API endpoints
- Progress tracking for large downloads
- Data compression for efficient transfer
- Version tracking for incremental updates
- Data integrity verification

## 🔄 **Detailed Workflow**

### **1. Pre-Event Setup (Online)**
```
Sub-challenge Leader Actions:
1. Install PWA on phone
2. Log in with credentials
3. Download all event data
4. Verify offline functionality
5. Go to remote checkpoint location
```

### **2. Offline Recording Process**
```
Squad Arrives → Recording Steps:
1. Search for squad in offline database
2. Record arrival time
3. Conduct sub-challenge
4. Record score and notes
5. Record departure time
6. Save to local storage
7. Queue for sync when online
```

### **3. Data Synchronization Process**
```
Internet Connection Restored:
1. Detect online status
2. Upload queued recordings
3. Handle any conflicts
4. Update local cache
5. Confirm successful sync
6. Clear sync queue
```

### **4. Conflict Resolution**
```
Data Conflicts Detected:
1. Compare local vs server data
2. Apply conflict resolution rules
3. Merge conflicting changes
4. Notify user of conflicts
5. Allow manual conflict resolution
6. Update both local and server data
```

## 📊 **Data Management**

### **Offline Data Structure**
```javascript
// IndexedDB Collections
{
  squads: [
    { id, name, members, scout_group, estimated_arrival_time }
  ],
  events: [
    { id, name, start_time, end_time, checkpoints }
  ],
  checkpoints: [
    { id, event_id, name, location, sub_challenge }
  ],
  offline_recordings: [
    { id, squad_id, checkpoint_id, arrival_time, departure_time, score, notes, sync_status }
  ],
  sync_queue: [
    { action, data, timestamp, retry_count }
  ]
}
```

### **Sync Queue Management**
```javascript
// Sync Queue Actions
{
  CREATE_RECORDING: "Create new performance recording",
  UPDATE_RECORDING: "Update existing recording",
  DELETE_RECORDING: "Delete recording",
  UPDATE_SQUAD: "Update squad information",
  SYNC_OFFLINE_DATA: "Sync all offline data"
}
```

### **Conflict Resolution Strategies**
```javascript
// Conflict Resolution Rules
{
  LAST_WRITE_WINS: "Use most recent timestamp",
  MERGE_CHANGES: "Combine non-conflicting fields",
  MANUAL_RESOLUTION: "Ask user to choose",
  SERVER_PRIORITY: "Server data takes precedence",
  CLIENT_PRIORITY: "Local data takes precedence"
}
```

## 🎛️ **Interface Requirements**

### **Offline Dashboard**
- **Squad List**: All squads assigned to checkpoint
- **Search/Filter**: Find squads quickly
- **Recording Interface**: Arrival, departure, score entry
- **Sync Status**: Pending uploads and sync progress
- **Offline Indicator**: Clear offline/online status

### **Recording Interface**
- **Squad Selection**: Choose squad from list
- **Time Recording**: Arrival and departure timestamps
- **Score Entry**: Sub-challenge score (0-100)
- **Notes Field**: Additional comments
- **Save Button**: Save to local storage
- **Sync Status**: Pending upload indicator

### **Sync Management**
- **Sync Progress**: Upload progress indicator
- **Conflict Resolution**: Handle data conflicts
- **Manual Sync**: Trigger sync manually
- **Sync History**: View sync logs and status

## 🔧 **Technical Implementation**

### **Service Worker Features**
```javascript
// Service Worker Capabilities
- Cache static assets for offline use
- Intercept network requests
- Handle background sync
- Manage push notifications
- Update app when new version available
```

### **IndexedDB Schema**
```sql
-- Local Database Tables
CREATE TABLE offline_squads (
  id, name, members, scout_group, estimated_arrival_time
);

CREATE TABLE offline_recordings (
  id, squad_id, checkpoint_id, arrival_time, departure_time, 
  score, notes, sync_status, created_at, updated_at
);

CREATE TABLE sync_queue (
  id, action, data, timestamp, retry_count, status
);
```

### **API Endpoints for Offline Support**
```javascript
// Offline-Supporting APIs
GET /api/offline-data - Download all data for offline use
POST /api/offline-recordings - Upload offline recordings
PUT /api/offline-recordings/:id - Update offline recording
GET /api/sync-status - Check sync status and conflicts
POST /api/force-sync - Manually trigger sync
```

### **Conflict Resolution Implementation**
```javascript
// Conflict Detection and Resolution
function detectConflicts(localData, serverData) {
  // Compare timestamps and data versions
  // Identify conflicting changes
  // Apply resolution strategies
  // Return resolved data
}

function resolveConflicts(localData, serverData, strategy) {
  switch(strategy) {
    case 'LAST_WRITE_WINS':
      return timestamp > serverData.timestamp ? localData : serverData;
    case 'MERGE_CHANGES':
      return mergeNonConflictingFields(localData, serverData);
    case 'MANUAL_RESOLUTION':
      return promptUserForResolution(localData, serverData);
  }
}
```

## 📱 **PWA Installation Requirements**

### **Web App Manifest**
```json
{
  "name": "Scout Challenge Recorder",
  "short_name": "Challenge Recorder",
  "description": "Offline sub-challenge recording app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### **Service Worker Registration**
```javascript
// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered');
    })
    .catch(error => {
      console.log('SW registration failed');
    });
}
```

This offline-first approach ensures sub-challenge leaders can work reliably in remote areas while maintaining data integrity and synchronization when connectivity is restored. 