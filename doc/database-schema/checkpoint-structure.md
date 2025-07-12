# Checkpoint and Sub-challenge Structure

## Overview
This document explains the corrected structure for checkpoints and sub-challenges in the Scout Challenge Management System.

## 🏮 **Checkpoint Structure**

### **All Checkpoints (15 lanterns):**
- **Physical Component**: Lantern with obliterator for proof of passage
- **Location**: GPS coordinates (latitude/longitude)
- **Order**: Sequential order in the orienteering route
- **Required**: Boolean flag for mandatory vs optional checkpoints
- **Sub-challenge**: Determined by existence of record in `checkpoint_sub_challenges` table

### **Two Types of Checkpoints:**

#### 1. **Simple Checkpoints**
- Just a lantern with obliterator
- **No sub-challenge**
- Squads prove passage by obliterating their paper
- Contributes to completion score only

#### 2. **Sub-challenge Checkpoints**
- Lantern with obliterator **PLUS** one sub-challenge
- **Maximum 1 sub-challenge per checkpoint**
- Squads must complete the sub-challenge AND obliterate
- Contributes to both completion score and sub-challenge score

## 🎯 **Sub-challenge Structure**

### **Sub-challenge Properties:**
- **Type**: Technical, physical, mental, navigation
- **Instructions**: Detailed task description
- **Equipment**: Required materials/tools
- **Time Limit**: Maximum time allowed (minutes)
- **Max Score**: Maximum points possible (0-100)
- **Scoring Method**: Points, time, binary

### **Sub-challenge Examples:**
- **Technical**: Measure tree height using trigonometry
- **Physical**: Climb a rock face with safety equipment
- **Mental**: Solve a puzzle or riddle
- **Navigation**: Use compass to find hidden object

## 📊 **Scoring System**

### **Composite Score Calculation:**
```
Composite Score = (Time Score × 0.4) + (Sub-challenge Score × 0.4) + (Completion Score × 0.2)
```

#### **1. Time Score (40% weight)**
- Total time from start to finish
- Lower time = higher score
- Normalized against event duration

#### **2. Sub-challenge Score (40% weight)**
- Sum of all sub-challenge scores
- Only checkpoints with sub-challenges contribute
- Maximum score per sub-challenge: 100 points

#### **3. Completion Score (20% weight)**
- Percentage of checkpoints completed
- All checkpoints (simple + sub-challenge) count equally
- Formula: `(completed_checkpoints / total_checkpoints) × 100`

## 🗄️ **Database Relationships**

### **Core Tables:**
```
checkpoints (1) ←→ (0..1) checkpoint_sub_challenges
checkpoint_sub_challenges (1) ←→ (1) sub_challenge_types
squad_performances (1) ←→ (0..1) sub_challenge_performances
```

### **Key Constraints:**
- **UNIQUE constraint**: Only one sub-challenge per checkpoint
- **Optional relationship**: Not all checkpoints have sub-challenges
- **Cascade deletion**: Remove sub-challenge if checkpoint is deleted

### **Querying Checkpoint Types:**
```sql
-- Checkpoints WITH sub-challenges
SELECT c.* FROM checkpoints c
INNER JOIN checkpoint_sub_challenges csc ON c.id = csc.checkpoint_id;

-- Checkpoints WITHOUT sub-challenges
SELECT c.* FROM checkpoints c
LEFT JOIN checkpoint_sub_challenges csc ON c.id = csc.checkpoint_id
WHERE csc.checkpoint_id IS NULL;
```

## 🔄 **Performance Recording Workflow**

### **For Simple Checkpoints:**
1. Squad arrives at checkpoint
2. Leader records arrival time
3. Squad obliterates paper (proof of passage)
4. Leader records departure time
5. System marks `obliterated = TRUE`

### **For Sub-challenge Checkpoints:**
1. Squad arrives at checkpoint
2. Leader records arrival time
3. Squad completes sub-challenge
4. Leader records sub-challenge score and time
5. Squad obliterates paper (proof of passage)
6. Leader records departure time
7. System marks `obliterated = TRUE` and stores sub-challenge performance

## 📈 **Leaderboard Calculation**

### **Real-time Updates:**
- **Checkpoint completion**: When `obliterated = TRUE`
- **Sub-challenge scores**: When sub-challenge performance is recorded
- **Time updates**: When arrival/departure times are recorded
- **Composite score**: Automatically recalculated

### **Example Scenario:**
```
Event: 15 checkpoints total
- 10 simple checkpoints (lanterns only)
- 5 sub-challenge checkpoints (lanterns + challenges)

Squad Performance:
- Completed: 12/15 checkpoints (80% completion)
- Sub-challenge scores: 85, 90, 75, 80, 95 (425 total)
- Total time: 180 minutes

Score Calculation:
- Time Score: 40% weight
- Sub-challenge Score: (425/500) × 40% = 34%
- Completion Score: (12/15) × 20% = 16%
- Composite Score: 40% + 34% + 16% = 90%
```

## 🎛️ **Administrative Interface**

### **Checkpoint Management:**
- Create/edit checkpoint locations
- Assign sub-challenges to checkpoints
- Set checkpoint order and requirements
- View checkpoint completion statistics

### **Sub-challenge Management:**
- Define sub-challenge types and scoring methods
- Create specific sub-challenges for checkpoints
- Set time limits and equipment requirements
- Monitor sub-challenge performance

This structure ensures clear separation between orienteering checkpoints and sub-challenges while maintaining accurate scoring and performance tracking. 