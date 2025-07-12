# Detailed Database Schema

## Overview
This document provides the complete database schema for the Scout Challenge Management System, including all tables, relationships, and constraints.

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    emergency_contact JSONB NOT NULL, -- {name, phone, relationship}
    scout_group_id UUID REFERENCES scout_groups(id),
    role VARCHAR(20) NOT NULL DEFAULT 'scout', -- scout, leader, admin, super_admin
    email_confirmed BOOLEAN DEFAULT FALSE,
    email_confirmation_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_scout_group_id ON users(scout_group_id);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Scout Groups Table
```sql
CREATE TABLE scout_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    event_id UUID REFERENCES events(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scout_groups_event_id ON scout_groups(event_id);
CREATE INDEX idx_scout_groups_active ON scout_groups(active);
```

### 3. Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed, cancelled
    max_squads INTEGER,
    registration_deadline TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

-- Indexes
```sql
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
```

### 4. Arrival Times Table
```sql
CREATE TABLE arrival_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    arrival_time TIMESTAMP NOT NULL,
    taken_by_squad_id UUID UNIQUE REFERENCES squads(id), -- nullable, only one squad can take a time
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, arrival_time)
);

-- Indexes
CREATE INDEX idx_arrival_times_event_id ON arrival_times(event_id);
CREATE INDEX idx_arrival_times_arrival_time ON arrival_times(arrival_time);
```

### 5. Squads Table
```sql
CREATE TABLE squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- age group or category
    scout_group_id UUID REFERENCES scout_groups(id),
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed
    created_by_user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),
    arrival_time_id UUID REFERENCES arrival_times(id) UNIQUE, -- squad's chosen arrival time
    actual_arrival_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

-- Remove estimated_arrival_time from squads table, as it's now managed by arrival_times.

### 5. Squad Members Table
```sql
CREATE TABLE squad_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- leader, member
    confirmed BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(squad_id, user_id)
);

-- Indexes
CREATE INDEX idx_squad_members_squad_id ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user_id ON squad_members(user_id);
CREATE INDEX idx_squad_members_confirmed ON squad_members(confirmed);
```

### 6. Checkpoints Table
```sql
CREATE TABLE checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    order_number INTEGER,
    required BOOLEAN DEFAULT TRUE,
    checkpoint_type VARCHAR(20) DEFAULT 'regular', -- regular, starting_point, finish_line
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
```

-- Indexes
CREATE INDEX idx_checkpoints_event_id ON checkpoints(event_id);
CREATE INDEX idx_checkpoints_order_number ON checkpoints(order_number);
```

### 7. Squad Performances Table
```sql
CREATE TABLE squad_performances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id),
    event_id UUID REFERENCES events(id),
    checkpoint_id UUID REFERENCES checkpoints(id),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
    obliterated BOOLEAN DEFAULT FALSE, -- Proof of passage via obliterator
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

-- Indexes
```sql
CREATE INDEX idx_squad_performances_squad_id ON squad_performances(squad_id);
CREATE INDEX idx_squad_performances_event_id ON squad_performances(event_id);
CREATE INDEX idx_squad_performances_checkpoint_id ON squad_performances(checkpoint_id);
```

### 8. Sub-challenge Types Table
```sql
CREATE TABLE sub_challenge_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    scoring_method VARCHAR(50), -- points, time, binary
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Checkpoint Sub-challenges Table
```sql
CREATE TABLE checkpoint_sub_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkpoint_id UUID REFERENCES checkpoints(id) UNIQUE, -- Only one sub-challenge per checkpoint
    sub_challenge_type_id UUID REFERENCES sub_challenge_types(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    instructions TEXT,
    equipment_required TEXT[],
    time_limit INTEGER, -- in minutes
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_checkpoint_sub_challenges_checkpoint_id ON checkpoint_sub_challenges(checkpoint_id);
```

### 10. Sub-challenge Performances Table
```sql
CREATE TABLE sub_challenge_performances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_performance_id UUID REFERENCES squad_performances(id),
    sub_challenge_id UUID REFERENCES checkpoint_sub_challenges(id),
    score INTEGER DEFAULT 0,
    completion_time INTEGER, -- in seconds
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sub_challenge_performances_squad_performance_id ON sub_challenge_performances(squad_performance_id);
```

### 11. Squad Validations Table
```sql
CREATE TABLE squad_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id),
    event_id UUID REFERENCES events(id),
    validated_by UUID REFERENCES users(id),
    validation_time TIMESTAMP DEFAULT NOW(),
    squad_name_modified BOOLEAN DEFAULT FALSE,
    scout_group_modified BOOLEAN DEFAULT FALSE,
    members_modified BOOLEAN DEFAULT FALSE,
    emergency_contact_modified BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_squad_validations_squad_id ON squad_validations(squad_id);
CREATE INDEX idx_squad_validations_event_id ON squad_validations(event_id);
CREATE INDEX idx_squad_validations_validated_by ON squad_validations(validated_by);
```

### 12. Offline Recordings Table
```sql
CREATE TABLE offline_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id),
    checkpoint_id UUID REFERENCES checkpoints(id),
    recorded_by UUID REFERENCES users(id),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
    score INTEGER DEFAULT 0,
    notes TEXT,
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, synced, failed, conflict
    device_id VARCHAR(255), -- Identifier for the device that created the recording
    local_timestamp TIMESTAMP, -- Timestamp when recorded locally
    server_timestamp TIMESTAMP, -- Timestamp when synced to server
    conflict_resolution VARCHAR(50), -- How conflict was resolved
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offline_recordings_squad_id ON offline_recordings(squad_id);
CREATE INDEX idx_offline_recordings_checkpoint_id ON offline_recordings(checkpoint_id);
CREATE INDEX idx_offline_recordings_sync_status ON offline_recordings(sync_status);
CREATE INDEX idx_offline_recordings_device_id ON offline_recordings(device_id);
```

### 13. Finish Line Validations Table
```sql
CREATE TABLE finish_line_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id),
    event_id UUID REFERENCES events(id),
    finish_time TIMESTAMP,
    papers_collected BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    final_score INTEGER,
    final_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_finish_line_validations_squad_id ON finish_line_validations(squad_id);
CREATE INDEX idx_finish_line_validations_event_id ON finish_line_validations(event_id);
CREATE INDEX idx_finish_line_validations_verified_by ON finish_line_validations(verified_by);
```

### 14. Paper Verifications Table
```sql
CREATE TABLE paper_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID REFERENCES squads(id),
    checkpoint_id UUID REFERENCES checkpoints(id),
    paper_quality VARCHAR(20), -- good, fair, poor, missing
    obliteration_verified BOOLEAN DEFAULT FALSE,
    timestamp_visible BOOLEAN DEFAULT FALSE,
    order_correct BOOLEAN DEFAULT FALSE,
    notes TEXT,
    verified_by UUID REFERENCES users(id),
    verification_time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_paper_verifications_squad_id ON paper_verifications(squad_id);
CREATE INDEX idx_paper_verifications_checkpoint_id ON paper_verifications(checkpoint_id);
CREATE INDEX idx_paper_verifications_verified_by ON paper_verifications(verified_by);
```

## Views

### 1. Squad Leaderboard View
```sql
CREATE VIEW squad_leaderboard AS
SELECT 
    s.id as squad_id,
    s.name as squad_name,
    sg.name as scout_group_name,
    e.id as event_id,
    e.name as event_name,
    COUNT(DISTINCT sp.checkpoint_id) as checkpoints_completed,
    COUNT(DISTINCT c.id) as total_checkpoints,
    SUM(COALESCE(scp.score, 0)) as sub_challenge_score,
    MIN(sp.arrival_time) as start_time,
    MAX(sp.departure_time) as end_time,
    EXTRACT(EPOCH FROM (MAX(sp.departure_time) - MIN(sp.arrival_time))) / 60 as total_time_minutes,
    -- Composite score: 40% time + 40% sub-challenge scores + 20% checkpoint completion
    (
        (EXTRACT(EPOCH FROM (MAX(sp.departure_time) - MIN(sp.arrival_time))) / 60 * 0.4) +
        (SUM(COALESCE(scp.score, 0)) * 0.4) +
        (COUNT(DISTINCT sp.checkpoint_id) * 100.0 / COUNT(DISTINCT c.id) * 0.2)
    ) as composite_score
FROM squads s
JOIN events e ON s.event_id = e.id
JOIN scout_groups sg ON s.scout_group_id = sg.id
LEFT JOIN squad_performances sp ON s.id = sp.squad_id
LEFT JOIN checkpoints c ON e.id = c.event_id
LEFT JOIN sub_challenge_performances scp ON sp.id = scp.squad_performance_id
WHERE e.status = 'active'
GROUP BY s.id, s.name, sg.name, e.id, e.name;
```

### 2. User Squad Association View
```sql
CREATE VIEW user_squad_association AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.surname,
    s.id as squad_id,
    s.name as squad_name,
    sm.role as squad_role,
    sm.confirmed as squad_confirmed,
    e.id as event_id,
    e.name as event_name
FROM users u
LEFT JOIN squad_members sm ON u.id = sm.user_id
LEFT JOIN squads s ON sm.squad_id = s.id
LEFT JOIN events e ON s.event_id = e.id
WHERE u.role = 'scout';
```

## Triggers

### 1. Update Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON squads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (apply to all other tables)
```

### 2. Squad Size Validation Trigger
```sql
CREATE OR REPLACE FUNCTION validate_squad_size()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM squad_members WHERE squad_id = NEW.squad_id) > 4 THEN
        RAISE EXCEPTION 'Squad cannot have more than 4 members';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_squad_size_trigger 
    BEFORE INSERT OR UPDATE ON squad_members 
    FOR EACH ROW EXECUTE FUNCTION validate_squad_size();
```

### 3. Time Slot Management Trigger
```sql
CREATE OR REPLACE FUNCTION manage_time_slot_capacity()
RETURNS TRIGGER AS $$
BEGIN
    -- When assigning a squad to a time slot
    IF NEW.time_slot_id IS NOT NULL AND (OLD.time_slot_id IS NULL OR OLD.time_slot_id != NEW.time_slot_id) THEN
        -- Check if time slot is available
        IF (SELECT status FROM time_slots WHERE id = NEW.time_slot_id) != 'available' THEN
            RAISE EXCEPTION 'Time slot is not available';
        END IF;
        
        -- Check if time slot has capacity
        IF (SELECT squads_assigned FROM time_slots WHERE id = NEW.time_slot_id) >= 
           (SELECT max_squads FROM time_slots WHERE id = NEW.time_slot_id) THEN
            RAISE EXCEPTION 'Time slot is full';
        END IF;
        
        -- Increment squads assigned
        UPDATE time_slots SET squads_assigned = squads_assigned + 1 WHERE id = NEW.time_slot_id;
        
        -- Update status if full
        UPDATE time_slots SET status = 'full' 
        WHERE id = NEW.time_slot_id 
        AND squads_assigned >= max_squads;
    END IF;
    
    -- When removing a squad from a time slot
    IF OLD.time_slot_id IS NOT NULL AND (NEW.time_slot_id IS NULL OR NEW.time_slot_id != OLD.time_slot_id) THEN
        -- Decrement squads assigned
        UPDATE time_slots SET squads_assigned = squads_assigned - 1 WHERE id = OLD.time_slot_id;
        
        -- Update status if no longer full
        UPDATE time_slots SET status = 'available' 
        WHERE id = OLD.time_slot_id 
        AND squads_assigned < max_squads;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER manage_time_slot_capacity_trigger 
    BEFORE INSERT OR UPDATE ON squads 
    FOR EACH ROW EXECUTE FUNCTION manage_time_slot_capacity();
```

## Constraints

### 1. Data Validation Constraints
```sql
-- Email format validation
ALTER TABLE users ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Age validation (scouts must be between 8 and 25)
ALTER TABLE users ADD CONSTRAINT valid_age CHECK (
    date_of_birth <= CURRENT_DATE - INTERVAL '8 years' AND 
    date_of_birth >= CURRENT_DATE - INTERVAL '25 years'
);

-- Sub-challenge score validation
ALTER TABLE sub_challenge_performances ADD CONSTRAINT valid_sub_challenge_score CHECK (score >= 0 AND score <= 100);

-- Time validation
ALTER TABLE squad_performances ADD CONSTRAINT valid_times CHECK (
    arrival_time IS NULL OR departure_time IS NULL OR departure_time >= arrival_time
);
```

### 2. Business Logic Constraints
```sql
-- Squad must have at least 2 members
ALTER TABLE squads ADD CONSTRAINT min_squad_size CHECK (
    (SELECT COUNT(*) FROM squad_members WHERE squad_id = id) >= 2
);

-- Squad cannot have more than 4 members (enforced by trigger)

-- Event must have valid time range
ALTER TABLE events ADD CONSTRAINT valid_event_times CHECK (end_time > start_time);

-- Checkpoint coordinates must be valid
ALTER TABLE checkpoints ADD CONSTRAINT valid_coordinates CHECK (
    latitude >= -90 AND latitude <= 90 AND
    longitude >= -180 AND longitude <= 180
);
```

## Indexes for Performance

### 1. Composite Indexes
```sql
-- Squad performance lookups
CREATE INDEX idx_squad_performances_squad_event ON squad_performances(squad_id, event_id);

-- User squad lookups
CREATE INDEX idx_squad_members_user_squad ON squad_members(user_id, squad_id);

-- Checkpoint order for events
CREATE INDEX idx_checkpoints_event_order ON checkpoints(event_id, order_number);
```

### 2. Full-text Search Indexes
```sql
-- Squad name search
CREATE INDEX idx_squads_name_search ON squads USING gin(to_tsvector('english', name));

-- User name search
CREATE INDEX idx_users_name_search ON users USING gin(to_tsvector('english', first_name || ' ' || surname));
```

This schema provides a robust foundation for the Scout Challenge Management System with proper relationships, constraints, and performance optimizations. 