# Employee Dashboard Profile - API Workflow Guide

## Overview
This document explains the complete API workflow for managing Work Experience and Education in the employee dashboard profile tab.

---

## Complete API Schema

```json
{
  "full_name": "string",
  "job_title": "string",
  "location": "string",
  "about_you": "string",
  "salary_expectation": {
    "expected_salary": 0
  },
  "notice_period_days": 0,
  "preferred_job_types": ["string"],
  "preferred_locations": ["string"],
  "remote_work": true,
  "skills": ["string"],
  "languages": ["string"],
  "work_experience": [
    {
      "job_title": "string",
      "job_role": "string",
      "company_name": "string",
      "experience_years": 0,
      "experience_months": 0,
      "currently_working_here": true
    }
  ],
  "education": [
    {
      "education_level": "string",
      "institute_school": "string",
      "year": "string"
    }
  ]
}
```

---

## Work Experience Management

### 1. Add New Work Experience

**User Action:** Click "+ Add" button in Work Experience section

**Frontend Process:**
1. Open profile dialog with "experience" section active
2. Initialize empty form with:
   ```javascript
   {
     job_title: "",
     job_role: "",
     company_name: "",
     experience_years: 0,
     experience_months: 0,
     currently_working_here: false
   }
   ```
3. User fills in the form
4. User clicks "Save changes"

**API Call:**
```
PATCH /employees/profile_update
Authorization: Bearer {token}

Body:
{
  "work_experience": [
    ...existing_experiences,
    {
      "job_title": "Backend Developer",
      "job_role": "Senior Developer",
      "company_name": "Tech Corp",
      "experience_years": 3,
      "experience_months": 6,
      "currently_working_here": true
    }
  ]
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "dashboard": {...},
    "user": {...}
  }
}
```

**Frontend After Save:**
1. Call `getEmployee()` to refresh user data
2. Call `getDashboard()` to refresh dashboard data
3. Close dialog
4. Display updated work experience in list

---

### 2. Edit Existing Work Experience

**User Action:** Click "Edit" button on any work experience card

**Frontend Process:**
1. Open profile dialog with "experience" section active
2. Set `editingExperienceIndex` to the clicked experience's index
3. Initialize form with the existing experience data:
   ```javascript
   {
     job_title: "Backend Developer",
     job_role: "Senior Developer",
     company_name: "Tech Corp",
     experience_years: 3,
     experience_months: 6,
     currently_working_here: true
   }
   ```
4. User edits the form
5. User clicks "Save changes"

**API Call:**
```
PATCH /employees/profile_update
Authorization: Bearer {token}

Body:
{
  "work_experience": [
    // ... other experiences remain unchanged ...
    {
      "job_title": "Backend Developer (Updated)",
      "job_role": "Lead Developer",
      "company_name": "Tech Corp",
      "experience_years": 4,
      "experience_months": 0,
      "currently_working_here": true
    },
    // ... remaining experiences ...
  ]
}
```

**Key Point:** The entire array is sent with the updated item at the specific index.

---

### 3. Delete Work Experience

**User Action:** Click "Delete" button on any work experience card

**Frontend Process:**
1. Filter out the experience at the clicked index
2. Call `deleteWorkExperience(index)` function

**API Call:**
```
PATCH /employees/profile_update
Authorization: Bearer {token}

Body:
{
  "work_experience": [
    // ... only experiences that remain, excluding the deleted one ...
  ]
}
```

---

### 4. Display Rules for Work Experience

**What to Show:**
- Only show non-null fields
- Hide fields that have empty strings or null values

**Display Format:**
```
[Card Layout]
┌─────────────────────────────────┐
│ Backend Developer               │
│ Senior Developer (if filled)    │ [Edit] [Delete]
│ Tech Corp                       │
│ 3 years 6 months                │
│ • Currently working here        │
└─────────────────────────────────┘
```

**Card Fields Logic:**
- `job_title`: Always show if present
- `job_role`: Show if filled (separate line if present)
- `company_name`: Show if filled
- Experience duration: Show if years > 0 OR months > 0
- `currently_working_here`: Show as badge if true

---

## Education Management

### 1. Add New Education

**User Action:** Click "+ Add" button in Education section (only shown if no education exists)

**Frontend Process:**
1. Open profile dialog with "education" section active
2. Check if `editingEducationIndex` is null (new record)
3. Initialize empty form:
   ```javascript
   {
     education_level: "",
     institute_school: "",
     year: ""
   }
   ```
4. User fills the form
5. User clicks "Save changes"

**API Call:**
```
PATCH /employees/profile_update
Authorization: Bearer {token}

Body:
{
  "education": [
    {
      "education_level": "Bachelor of Science",
      "institute_school": "ABC University",
      "year": "2015-2019"
    }
  ]
}
```

---

### 2. Edit Existing Education

**User Action:** Click "Edit" button in Education section (only shown if education exists)

**Frontend Process:**
1. Open profile dialog with "education" section active
2. Set `editingEducationIndex` to 0 (first/only record)
3. Initialize form with existing data:
   ```javascript
   {
     education_level: "Bachelor of Science",
     institute_school: "ABC University",
     year: "2015-2019"
   }
   ```
4. User edits the form
5. User clicks "Save changes"

**API Call:**
```
PATCH /employees/profile_update
Authorization: Bearer {token}

Body:
{
  "education": [
    {
      "education_level": "Master of Science",
      "institute_school": "ABC University",
      "year": "2015-2021"
    }
  ]
}
```

---

### 3. No Delete for Education

**Reason:** Education is treated as single important data (not a list), so there's no delete button.

To clear education, user would need to edit and leave fields empty, then save.

---

### 4. Display Rules for Education

**What to Show:**
- Only show the first education record (index 0)
- Hide all null or empty fields
- No list view - single record only

**Display Format:**
```
[Card Layout - Single Record]
┌──────────────────────────────┐
│ Bachelor of Science          │
│ ABC University               │ [Edit]
│ 2015-2019                    │
└──────────────────────────────┘
```

**Button Rules:**
- Show "Add" button if `educationItems.length === 0`
- Show "Edit" button if `educationItems.length > 0`

---

## Field Filtering Logic

### For Display (Not Storing Null Values)

The frontend only displays fields that have values:

```typescript
// Example for work experience
if (item.job_title) {
  // show job_title
}
if (item.job_role) {
  // show job_role
}
if (item.company_name) {
  // show company_name
}
```

### For Submission

Fields are sent as-is to the backend:
- Empty strings: sent as empty strings
- Numbers (0): sent as 0
- Booleans: sent as boolean values
- Null: not included in request

---

## Complete User Journey Example

### Scenario: Adding and Editing Work Experience

```
1. User navigates to Dashboard → Profile tab
2. Sees "Add" button under Work Experience section
3. Clicks "Add" → Profile dialog opens
4. Fills in:
   - Job Title: "Backend Developer"
   - Job Role: "Senior Developer"
   - Company: "Tech Corp"
   - Years: 3, Months: 6
   - Currently Working: checked
5. Clicks "Save changes"
6. API call: PATCH /employees/profile_update
7. Server updates profile with new experience
8. Frontend refreshes data
9. User sees new card in Work Experience section
10. Later, user clicks "Edit" on the card
11. Dialog opens with pre-filled data
12. Updates Years to 4
13. Clicks "Save changes"
14. API updates experience at same index
15. Frontend refreshes
16. User sees updated card
17. User clicks "Delete"
18. Experience removed from array
19. API call made without that experience
20. Card disappears from display
```

---

## Error Handling

### Add/Edit Experience Errors:
- Must fill either `job_title` OR `company_name`
- Show validation message if both are empty

### Add/Edit Education Errors:
- Must fill either `education_level` OR `institute_school`
- Show validation message if both are empty

### API Errors:
- Display in profile dialog as red message
- Suggest user retry
- Don't close dialog on error

---

## State Management

### Zustand Store (`employeeStore.js`):
- `getEmployee()`: Fetch user profile
- `completeProfile(data)`: PATCH profile_update
- `user`: Current user data with work_experience and education arrays

### Component State (`Dashboard.tsx`):
- `workExperience`: Array from user.work_experience
- `educationItems`: Array from user.education
- `editingExperienceIndex`: Current index being edited (null = new)
- `editingEducationIndex`: Current index being edited (null = new)
- `experienceDraft`: Form data for experience
- `educationDraft`: Form data for education

---

## Summary

| Feature | Work Experience | Education |
|---------|-----------------|-----------|
| Type | Multiple (Array) | Single (First Item) |
| Add Button | "Add" (always visible) | "Add" (if no data) |
| Edit Button | Per item | "Edit" (if data exists) |
| Delete Button | Per item | No delete button |
| Display | All items as cards | First item only |
| Filter Nulls | Yes | Yes |
| Max Records | Unlimited | 1 (practically) |
