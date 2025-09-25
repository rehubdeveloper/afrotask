# AfroTask API Documentation

## Table of Contents
1. [Authentication System](#authentication-system)
2. [User Management](#user-management)
3. [Project & Bidding System](#project--bidding-system)
4. [Communication System](#communication-system)
5. [Reporting & Moderation](#reporting--moderation)
6. [Admin Analytics](#admin-analytics)
7. [File Upload System](#file-upload-system)
8. [Notifications](#notifications)
9. [Admin Management](#admin-management)
10. [Utility Endpoints](#utility-endpoints)
11. [Error Handling](#error-handling)
12. [Data Models](#data-models)

---

## Authentication System

### Base URL
```
http://localhost:8000/api/
```

### Authentication Headers
```javascript
{
  "Authorization": "Token your_auth_token_here",
  "Content-Type": "application/json"
}
```

### Important Note: User IDs
All endpoints use the **primary user ID** from the User model. This means:
- **Client ID** = User ID of the client
- **Freelancer ID** = User ID of the freelancer
- **Admin ID** = User ID of the admin

There are no separate "client_id" or "freelancer_id" fields - we use the unified User model ID for all user types.

### 1. Freelancer Signup
**POST** `/auth/freelancer/signup/`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "skills": ["Python", "Django", "React"],
  "github_profile": "https://github.com/johndoe",
  "portfolio_links": ["https://johndoe.dev", "https://portfolio.com"],
  "experience_description": "5 years of web development experience",
  "education": "Computer Science Degree"
}
```

**Response (201):**
```json
{
  "message": "Freelancer account created successfully",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "user_type": "freelancer",
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "freelancer": {
    "id": 1,
    "skills": ["Python", "Django", "React"],
    "github_profile": "https://github.com/johndoe",
    "portfolio_links": ["https://johndoe.dev", "https://portfolio.com"],
    "experience_description": "5 years of web development experience",
    "education": "Computer Science Degree",
    "is_verified": false,
    "is_pending_review": true
  },
  "token": "your_auth_token_here"
}
```

### 2. Client Signup
**POST** `/auth/client/signup/`

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@company.com",
  "password": "securepassword123",
  "company_name": "Tech Solutions Inc",
  "location": "Lagos, Nigeria"
}
```

**Response (201):**
```json
{
  "message": "Client account created successfully",
  "user": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com",
    "user_type": "client",
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "client": {
    "id": 1,
    "company_name": "Tech Solutions Inc",
    "location": "Lagos, Nigeria"
  },
  "token": "your_auth_token_here"
}
```

### 3. Login
**POST** `/auth/login/`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "user_type": "freelancer",
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "token": "your_auth_token_here"
}
```

### 4. Logout
**POST** `/auth/logout/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### 5. Get Auth Token (Alternative Login)
**POST** `/api-token-auth/`

**Request Body:**
```json
{
  "username": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "your_auth_token_here"
}
```

**Response (400) - Invalid credentials:**
```json
{
  "non_field_errors": [
    "Unable to log in with provided credentials."
  ]
}
```

---

## User Management

### 1. Get User Profile
**GET** `/profile/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "user_type": "freelancer",
  "date_joined": "2024-01-15T10:30:00Z",
  "freelancer_profile": {
    "id": 1,
    "skills": ["Python", "Django", "React"],
    "github_profile": "https://github.com/johndoe",
    "portfolio_links": ["https://johndoe.dev"],
    "experience_description": "5 years of web development experience",
    "education": "Computer Science Degree",
    "is_verified": false,
    "is_pending_review": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Update Freelancer Profile
**PUT** `/profile/freelancer/update/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "skills": ["Python", "Django", "React", "Vue.js"],
  "github_profile": "https://github.com/johndoe",
  "portfolio_links": ["https://johndoe.dev", "https://newportfolio.com"],
  "experience_description": "6 years of web development experience with focus on full-stack development",
  "education": "Computer Science Degree with focus on Software Engineering"
}
```

**Response (200):**
```json
{
  "message": "Freelancer profile updated successfully",
  "freelancer": {
    "id": 1,
    "skills": ["Python", "Django", "React", "Vue.js"],
    "github_profile": "https://github.com/johndoe",
    "portfolio_links": ["https://johndoe.dev", "https://newportfolio.com"],
    "experience_description": "6 years of web development experience with focus on full-stack development",
    "education": "Computer Science Degree with focus on Software Engineering",
    "is_verified": false,
    "is_pending_review": true,
    "updated_at": "2024-01-16T10:30:00Z"
  }
}
```

### 3. Update Client Profile
**PUT** `/profile/client/update/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "company_name": "Updated Tech Solutions Inc",
  "location": "Abuja, Nigeria"
}
```

**Response (200):**
```json
{
  "message": "Client profile updated successfully",
  "client": {
    "id": 1,
    "company_name": "Updated Tech Solutions Inc",
    "location": "Abuja, Nigeria",
    "updated_at": "2024-01-16T10:30:00Z"
  }
}
```

### 4. Freelancer Reapplication
**POST** `/profile/freelancer/reapply/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "skills": ["Python", "Django", "React", "Node.js"],
  "github_profile": "https://github.com/johndoe",
  "portfolio_links": ["https://johndoe.dev", "https://newproject.com"],
  "experience_description": "Updated experience with more projects and technologies",
  "education": "Computer Science Degree with additional certifications"
}
```

**Response (200):**
```json
{
  "message": "Reapplication submitted successfully with updated information. Your application is under review.",
  "freelancer": {
    "id": 1,
    "skills": ["Python", "Django", "React", "Node.js"],
    "is_pending_review": true,
    "is_verified": false,
    "updated_at": "2024-01-16T10:30:00Z"
  }
}
```

### 5. Client Reapplication
**POST** `/profile/client/reapply/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "company_name": "New Company Name",
  "location": "Lagos, Nigeria"
}
```

**Response (200):**
```json
{
  "message": "Client profile updated successfully.",
  "client": {
    "id": 1,
    "company_name": "New Company Name",
    "location": "Lagos, Nigeria",
    "updated_at": "2024-01-16T10:30:00Z"
  }
}
```

### 6. Get Verified Freelancers (Public)
**GET** `/freelancers/verified/`

**Query Parameters:**
- `skills` (optional): Comma-separated skills filter (e.g., `Python,Django,React`)
- `search` (optional): Search in name, skills, experience
- `location` (optional): Filter by location
- `min_experience` (optional): Minimum years of experience
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `/freelancers/verified/?skills=Python,Django&search=web&page=1&limit=5`

**Response (200):**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/freelancers/verified/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "freelancer",
      "freelancer_profile": {
        "id": 1,
        "skills": ["Python", "Django", "React"],
        "github_profile": "https://github.com/johndoe",
        "portfolio_links": ["https://johndoe.dev"],
        "experience_description": "5 years of web development experience",
        "education": "Computer Science Degree",
        "is_verified": true,
        "is_pending_review": false,
        "rating": "4.80",
        "completed_projects": 25,
        "response_time_hours": 2,
        "response_time": "2 hours"
      }
    }
  ]
}
```

### 7. Get Individual Freelancer Profile
**GET** `/freelancers/{freelancer_id}/`

**Headers:** `Authorization: Token your_auth_token_here` (required)

**Note:** `freelancer_id` is the **User ID** of the freelancer, not a separate freelancer ID.

**Response (200):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "user_type": "freelancer",
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "skills": ["Python", "Django", "React", "PostgreSQL"],
  "github_profile": "https://github.com/johndoe",
  "portfolio_links": ["https://johndoe.dev", "https://portfolio.com"],
  "experience_description": "5 years of web development experience with expertise in Django, React, and PostgreSQL. I have successfully delivered 25+ projects including e-commerce platforms, SaaS applications, and mobile apps.",
  "education": "Computer Science Degree from University of Technology",
  "is_verified": true,
  "is_pending_review": false,
  "rating": "4.80",
  "completed_projects": 25,
  "response_time_hours": 2,
  "response_time": "2 hours",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:30:00Z"
}
```

**Response (404) - Freelancer not found:**
```json
{
  "error": "Freelancer not found"
}
```

**Response (404) - Freelancer not verified:**
```json
{
  "error": "Freelancer profile not found or not verified"
}
```

---

## Project & Bidding System

### 1. Get Project Categories
**GET** `/project-categories/`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Web Development",
    "description": "Frontend and backend web development projects",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Mobile Development",
    "description": "iOS and Android mobile app development",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2. List Active Projects
**GET** `/projects/`

**Query Parameters:**
- `category` (optional): Filter by category name
- `skills` (optional): Comma-separated skills (e.g., "Python,Django")
- `min_budget` (optional): Minimum budget in NGN
- `max_budget` (optional): Maximum budget in NGN
- `search` (optional): Search in title and description

**Example:** `/projects/?category=Web Development&skills=Python,Django&min_budget=50000&search=website`

**Response (200):**
```json
[
  {
    "id": 1,
    "client": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com",
      "user_type": "client",
      "date_joined": "2024-01-15T10:30:00Z"
    },
    "title": "E-commerce Website Development",
    "description": "Need a full-stack e-commerce website with payment integration",
    "category": {
      "id": 1,
      "name": "Web Development",
      "description": "Frontend and backend web development projects"
    },
    "required_skills": ["Python", "Django", "React", "PostgreSQL"],
    "budget": "150000.00",
    "duration_days": 30,
    "status": "active",
    "project_type": "public",
    "location": "Remote",
    "awarded_freelancer": null,
    "awarded_at": null,
    "completed_at": null,
    "client_approved_at": null,
    "client_approval_deadline": null,
    "files": [],
    "bids": [],
    "milestones": [],
    "bid_count": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### 3. Create Project (Clients Only)
**POST** `/projects/create/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "title": "E-commerce Website Development",
  "description": "Need a full-stack e-commerce website with payment integration, user authentication, and admin dashboard",
  "category": 1,
  "required_skills": ["Python", "Django", "React", "PostgreSQL"],
  "budget": "150000.00",
  "duration_days": 30,
  "project_type": "public",
  "location": "Remote",
  "target_freelancer": null,
  "chat_room_id": null
}
```

**Note:** 
- `target_freelancer`: **User ID** of specific freelancer for private projects (optional)
- `chat_room_id`: ID of existing chat room for private projects (optional)
- All user references use the **primary User model ID**, not separate client/freelancer IDs

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "client": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com",
      "user_type": "client",
      "date_joined": "2024-01-15T10:30:00Z"
    },
    "title": "E-commerce Website Development",
    "description": "Need a full-stack e-commerce website with payment integration",
    "category": {
      "id": 1,
      "name": "Web Development"
    },
    "required_skills": ["Python", "Django", "React", "PostgreSQL"],
    "budget": "150000.00",
    "duration_days": 30,
    "status": "active",
    "project_type": "public",
    "location": "Remote",
    "target_freelancer": null,
    "chat_room_id": null,
    "is_editable": true,
    "bid_count": 0,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Get Project Details
**GET** `/projects/{project_id}/`

**Response (200):**
```json
{
  "id": 1,
  "client": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com",
    "user_type": "client",
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "title": "E-commerce Website Development",
  "description": "Need a full-stack e-commerce website with payment integration",
  "category": {
    "id": 1,
    "name": "Web Development"
  },
  "required_skills": ["Python", "Django", "React", "PostgreSQL"],
  "budget": "150000.00",
  "duration_days": 30,
  "status": "active",
  "project_type": "public",
  "location": "Remote",
  "awarded_freelancer": null,
  "awarded_at": null,
  "completed_at": null,
  "client_approved_at": null,
  "client_approval_deadline": null,
  "files": [],
  "bids": [],
  "milestones": [],
  "bid_count": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 5. Update Project (Project Owner Only)
**PUT** `/projects/{project_id}/update/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "title": "Updated E-commerce Website Development",
  "description": "Updated description with more details",
  "budget": "200000.00",
  "duration_days": 45
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "title": "Updated E-commerce Website Development",
    "budget": "200000.00",
    "duration_days": 45,
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

**Response (400) - Field locked:**
```json
{
  "error": "Project editing is locked",
  "message": "The following fields cannot be edited: title, description, budget",
  "locked_fields": ["title", "description", "budget"],
  "editable_fields": ["status", "milestones"]
}
```

**Response (400) - Invalid status transition:**
```json
{
  "error": "Invalid status transition",
  "message": "Clients cannot change project status from active to in_progress",
  "allowed_transitions": ["cancelled", "paused", "on_hold"]
}
```

**Response (400) - Permission denied:**
```json
{
  "error": "Permission denied",
  "message": "Only the awarded freelancer can set project to in_progress"
}
```

## 📋 **Project Status Workflow:**

### **Client Permissions:**
- `draft` → `active`, `cancelled`
- `active` → `cancelled`, `paused`, `on_hold`
- `in_progress` → `cancelled`, `paused`, `on_hold`
- `completed` → `cancelled`
- `paused` → `active`, `cancelled`
- `on_hold` → `active`, `cancelled`

### **Freelancer Permissions (Awarded Freelancer Only):**
- `active` → `in_progress` (only if project is awarded to them)
- `in_progress` → `completed`, `cancelled`, `paused`, `on_hold`
- `completed` → `cancelled`
- `paused` → `in_progress`, `cancelled`
- `on_hold` → `in_progress`, `cancelled`

### **Admin Permissions:**
- Can change to any status at any time

### 6. Delete Project (Project Owner Only)
**DELETE** `/projects/{project_id}/delete/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

### 7. Submit Bid (Verified Freelancers Only)
**POST** `/projects/{project_id}/bids/create/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "proposed_price": "120000.00",
  "timeline_days": 25,
  "approach_methodology": "I will use Django for backend, React for frontend, and PostgreSQL for database. I'll implement user authentication, product management, shopping cart, and payment integration using Stripe.",
  "cover_letter": "I have 5 years of experience in e-commerce development and have successfully delivered similar projects. I'm confident I can deliver high-quality work within the timeline.",
  "questions_for_client": "Do you have any specific design preferences? What payment methods do you want to support?"
}
```

**Response (201):**
```json
{
  "message": "Bid submitted successfully",
  "bid": {
    "id": 1,
    "freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "freelancer"
    },
    "proposed_price": "120000.00",
    "timeline_days": 25,
    "approach_methodology": "I will use Django for backend, React for frontend...",
    "cover_letter": "I have 5 years of experience...",
    "questions_for_client": "Do you have any specific design preferences?",
    "status": "submitted",
    "files": [],
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

### 8. Get Project Bids (Project Owner Only)
**GET** `/projects/{project_id}/bids/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "freelancer"
    },
    "proposed_price": "120000.00",
    "timeline_days": 25,
    "approach_methodology": "I will use Django for backend...",
    "cover_letter": "I have 5 years of experience...",
    "questions_for_client": "Do you have any specific design preferences?",
    "status": "submitted",
    "files": [],
    "created_at": "2024-01-15T12:00:00Z"
  }
]
```

### 9. Get Bid Details
**GET** `/bids/{bid_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "id": 1,
  "project": {
    "id": 1,
    "title": "E-commerce Website Development",
    "client": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com"
    }
  },
  "freelancer": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "user_type": "freelancer"
  },
  "proposed_price": "120000.00",
  "timeline_days": 25,
  "approach_methodology": "I will use Django for backend, React for frontend, and PostgreSQL for database. I'll implement user authentication, product management, shopping cart, and payment integration using Stripe.",
  "cover_letter": "I have 5 years of experience in e-commerce development and have successfully delivered similar projects. I'm confident I can deliver high-quality work within the timeline.",
  "questions_for_client": "Do you have any specific design preferences? What payment methods do you want to support?",
  "status": "submitted",
  "files": [],
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

### 10. Award Project (Project Owner Only)
**POST** `/projects/{project_id}/award/{bid_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "Project awarded successfully",
  "project": {
    "id": 1,
    "status": "in_progress",
    "awarded_freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "awarded_at": "2024-01-15T13:00:00Z"
  }
}
```

### 11. Update Bid (Bid Owner Only)
**PUT** `/bids/{bid_id}/update/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "proposed_price": "110000.00",
  "timeline_days": 20,
  "approach_methodology": "Updated methodology with more details"
}
```

**Response (200):**
```json
{
  "message": "Bid updated successfully",
  "bid": {
    "id": 1,
    "proposed_price": "110000.00",
    "timeline_days": 20,
    "updated_at": "2024-01-15T14:00:00Z"
  }
}
```

### 12. Withdraw Bid (Bid Owner Only)
**POST** `/bids/{bid_id}/withdraw/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "Bid withdrawn successfully"
}
```

---

## Notifications

### 1. Get User Notifications
**GET** `/notifications/`

**Headers:** `Authorization: Token your_auth_token_here`

**Query Parameters:**
- `page`: Page number (optional, default: 1)
- `unread_only`: Show only unread notifications (optional, default: false)

**Response (200):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/notifications/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "notification_type": "new_bid_received",
      "title": "New Bid Received",
      "message": "You have received a new bid from John Doe for your project 'E-commerce Website Development'.",
      "is_read": false,
      "related_object_id": 1,
      "related_object_type": "bid",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "notification_type": "bid_awarded",
      "title": "Bid Awarded",
      "message": "Congratulations! Your bid for 'Mobile App Development' has been awarded.",
      "is_read": true,
      "related_object_id": 2,
      "related_object_type": "bid",
      "created_at": "2024-01-14T15:20:00Z"
    }
  ]
}
```

### 2. Get Notification Detail
**GET** `/notifications/{notification_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "id": 1,
  "notification_type": "new_bid_received",
  "title": "New Bid Received",
  "message": "You have received a new bid from John Doe for your project 'E-commerce Website Development'.",
  "is_read": false,
  "related_object_id": 1,
  "related_object_type": "bid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 3. Mark Notification as Read
**PATCH** `/notifications/{notification_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "is_read": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "notification_type": "new_bid_received",
  "title": "New Bid Received",
  "message": "You have received a new bid from John Doe for your project 'E-commerce Website Development'.",
  "is_read": true,
  "related_object_id": 1,
  "related_object_type": "bid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

### 4. Mark All Notifications as Read
**POST** `/notifications/mark-all-read/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "updated_count": 5
}
```

---

## File Upload System

### 1. Upload Project File
**POST** `/projects/{project_id}/files/upload/`

**Headers:** 
```
Authorization: Token your_auth_token_here
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: The file to upload
- `file_category`: One of: "project_brief", "reference_material", "requirement_doc", "deliverable", "milestone_submission", "final_submission", "other"
- `description`: Optional description
- `is_final_submission`: Boolean (true/false)

**Example using JavaScript FormData:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('file_category', 'project_brief');
formData.append('description', 'Project requirements document');
formData.append('is_final_submission', 'false');

fetch('/api/projects/1/files/upload/', {
  method: 'POST',
  headers: {
    'Authorization': 'Token your_auth_token_here'
  },
  body: formData
});
```

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "file": "/media/project_files/2024/01/15/requirements.pdf",
    "file_name": "requirements.pdf",
    "file_size": 1024000,
    "file_category": "project_brief",
    "description": "Project requirements document",
    "is_final_submission": false,
    "uploaded_by": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com"
    },
    "created_at": "2024-01-15T15:00:00Z"
  }
}
```

### 2. Upload Bid File
**POST** `/bids/{bid_id}/files/upload/`

**Headers:** 
```
Authorization: Token your_auth_token_here
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: The file to upload
- `file_category`: One of: "portfolio_sample", "proposal_doc", "work_sample", "other"
- `description`: Optional description

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "file": "/media/bid_files/2024/01/15/portfolio.pdf",
    "file_name": "portfolio.pdf",
    "file_size": 2048000,
    "file_category": "portfolio_sample",
    "description": "My previous e-commerce projects",
    "created_at": "2024-01-15T15:30:00Z"
  }
}
```

---

## Milestone System

### 1. Create Milestone (Project Owner Only)
**POST** `/projects/{project_id}/milestones/create/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "title": "User Authentication System",
  "description": "Implement user registration, login, and profile management",
  "due_date": "2024-02-01T23:59:59Z",
  "order": 1
}
```

**Response (201):**
```json
{
  "message": "Milestone created successfully",
  "milestone": {
    "id": 1,
    "title": "User Authentication System",
    "description": "Implement user registration, login, and profile management",
    "due_date": "2024-02-01T23:59:59Z",
    "status": "pending",
    "order": 1,
    "created_at": "2024-01-15T16:00:00Z"
  }
}
```

### 2. Submit Milestone (Awarded Freelancer Only)
**POST** `/milestones/{milestone_id}/submit/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "description": "User authentication system completed with registration, login, password reset, and profile management features. All tests passing."
}
```

**Response (201):**
```json
{
  "message": "Milestone submitted successfully",
  "submission": {
    "id": 1,
    "description": "User authentication system completed...",
    "submitted_at": "2024-01-20T10:00:00Z",
    "submitted_by": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### 3. Approve/Reject Milestone (Project Owner Only)
**POST** `/milestones/{milestone_id}/approve/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "status": "approved",
  "feedback": "Great work! The authentication system is working perfectly. Please proceed to the next milestone."
}
```

**Response (200):**
```json
{
  "message": "Milestone approved successfully",
  "milestone": {
    "id": 1,
    "status": "approved",
    "updated_at": "2024-01-20T11:00:00Z"
  }
}
```

### 15. Create Direct Chat with Freelancer
**POST** `/chat-rooms/create-direct/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "freelancer_id": 1,
  "initial_message": "Hi! I'd like to discuss a potential project with you."
}
```

**Response (201):**
```json
{
  "message": "Chat room created successfully",
  "chat_room": {
    "id": 5,
    "chat_type": "direct_message",
    "title": "Direct Chat: John Doe",
    "is_active": true,
    "participants": [
      {
        "id": 1,
        "user": {
          "id": 2,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane@company.com"
        },
        "joined_at": "2024-01-15T13:00:00Z",
        "is_active": true
      },
      {
        "id": 2,
        "user": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@example.com"
        },
        "joined_at": "2024-01-15T13:00:00Z",
        "is_active": true
      }
    ],
    "created_at": "2024-01-15T13:00:00Z"
  },
  "initial_message": {
    "id": 1,
    "sender": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "message_type": "text",
    "content": "Hi! I'd like to discuss a potential project with you.",
    "created_at": "2024-01-15T13:00:00Z"
  }
}
```

### 16. Create Private Project from Chat
**POST** `/projects/create-private/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "title": "Private E-commerce Project",
  "description": "Custom e-commerce solution for John Doe",
  "category": 1,
  "required_skills": ["Python", "Django", "React"],
  "budget": "120000.00",
  "duration_days": 25,
  "location": "Remote",
  "target_freelancer": 1,
  "chat_room_id": 5
}
```

**Response (201):**
```json
{
  "message": "Private project created successfully",
  "project": {
    "id": 2,
    "title": "Private E-commerce Project",
    "description": "Custom e-commerce solution for John Doe",
    "category": {
      "id": 1,
      "name": "Web Development"
    },
    "required_skills": ["Python", "Django", "React"],
    "budget": "120000.00",
    "duration_days": 25,
    "status": "active",
    "project_type": "private",
    "location": "Remote",
    "target_freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "chat_room_id": 5,
    "is_editable": true,
    "files": [],
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

### 17. Create Project with Files
**POST** `/projects/create-with-files/`

**Headers:** `Authorization: Token your_auth_token_here`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
title: E-commerce Website Development
description: Need a full-stack e-commerce website with payment integration
category: 1
required_skills: ["Python", "Django", "React", "PostgreSQL"]
budget: 150000.00
duration_days: 30
project_type: public
location: Remote
target_freelancer: (optional)
chat_room_id: (optional)
files: [file1, file2, file3]
file_categories: ["project_brief", "reference_material", "requirement_doc"]
file_descriptions: ["Project requirements", "Design mockups", "Technical specs"]
```

**Response (201):**
```json
{
  "message": "Project created successfully with files",
  "project": {
    "id": 3,
    "title": "E-commerce Website Development",
    "description": "Need a full-stack e-commerce website...",
    "category": {
      "id": 1,
      "name": "Web Development"
    },
    "required_skills": ["Python", "Django", "React"],
    "budget": "150000.00",
    "duration_days": 30,
    "status": "active",
    "project_type": "public",
    "location": "Remote",
    "is_editable": true,
    "files": [
      {
        "id": 1,
        "file": "/media/project_files/2024/01/15/requirements.pdf",
        "file_name": "requirements.pdf",
        "file_size": 1024000,
        "file_category": "project_brief",
        "description": "Project requirements",
        "created_at": "2024-01-15T15:00:00Z"
      },
      {
        "id": 2,
        "file": "/media/project_files/2024/01/15/mockups.zip",
        "file_name": "mockups.zip",
        "file_size": 2048000,
        "file_category": "reference_material",
        "description": "Design mockups",
        "created_at": "2024-01-15T15:00:00Z"
      }
    ],
    "created_at": "2024-01-15T15:00:00Z"
  },
  "uploaded_files": [
    {
      "id": 1,
      "file": "/media/project_files/2024/01/15/requirements.pdf",
      "file_name": "requirements.pdf",
      "file_size": 1024000,
      "file_category": "project_brief",
      "description": "Project requirements",
      "created_at": "2024-01-15T15:00:00Z"
    }
  ]
}
```

### 18. Lock Project Editing
**PATCH** `/projects/{project_id}/lock-editing/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "is_editable": false,
  "reason": "Project has started - freelancer assigned"
}
```

**Response (200):**
```json
{
  "message": "Project editing locked successfully",
  "project": {
    "id": 1,
    "is_editable": false,
    "locked_at": "2024-01-16T10:00:00Z",
    "locked_reason": "Project has started - freelancer assigned"
  }
}
```

### 19. Get Project Editability Status
**GET** `/projects/{project_id}/editability/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "id": 1,
  "is_editable": false,
  "locked_at": "2024-01-16T10:00:00Z",
  "locked_reason": "Project has started - freelancer assigned",
  "can_edit_fields": ["status", "milestones"],
  "cannot_edit_fields": ["title", "description", "budget", "duration_days"]
}
```

---

## Communication System

### 1. Get User's Chat Rooms
**GET** `/chat-rooms/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "project": {
      "id": 1,
      "title": "E-commerce Website Development"
    },
    "chat_type": "project_chat",
    "title": "Project Chat: E-commerce Website Development",
    "is_active": true,
    "participants": [
      {
        "id": 1,
        "user": {
          "id": 2,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane@company.com"
        },
        "joined_at": "2024-01-15T13:00:00Z",
        "is_active": true
      },
      {
        "id": 2,
        "user": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@example.com"
        },
        "joined_at": "2024-01-15T13:00:00Z",
        "is_active": true
      }
    ],
    "messages": [
      {
        "id": 1,
        "sender": {
          "id": 2,
          "first_name": "Jane",
          "last_name": "Smith"
        },
        "message_type": "text",
        "content": "Welcome to the project! Let's discuss the requirements.",
        "created_at": "2024-01-15T13:05:00Z"
      }
    ],
    "created_at": "2024-01-15T13:00:00Z",
    "updated_at": "2024-01-15T13:05:00Z"
  }
]
```

### 2. Get Chat Room Details
**GET** `/chat-rooms/{chat_room_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "id": 1,
  "project": {
    "id": 1,
    "title": "E-commerce Website Development"
  },
  "chat_type": "project_chat",
  "title": "Project Chat: E-commerce Website Development",
  "is_active": true,
  "participants": [...],
  "messages": [...],
  "created_at": "2024-01-15T13:00:00Z",
  "updated_at": "2024-01-15T13:05:00Z"
}
```

### 3. Send Message
**POST** `/chat-rooms/{chat_room_id}/messages/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body (Text Message):**
```json
{
  "message_type": "text",
  "content": "Hello! I have a question about the payment integration requirements."
}
```

**Request Body (File Message):**
```json
{
  "message_type": "file",
  "content": "Here's the updated design mockup"
}
```

**Form Data for File Message:**
```
message_type: file
content: Here's the updated design mockup
file: [file data]
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "message_data": {
    "id": 2,
    "sender": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "message_type": "text",
    "content": "Hello! I have a question about the payment integration requirements.",
    "created_at": "2024-01-15T13:10:00Z"
  }
}
```

---

## Project Completion & Approval

### 1. Submit Final Project (Freelancer Only)
**POST** `/projects/{project_id}/files/upload/`

**Headers:** 
```
Authorization: Token your_auth_token_here
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Final project files (zip file recommended)
- `file_category`: "final_submission"
- `description`: "Final project delivery"
- `is_final_submission`: "true"

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 5,
    "file_category": "final_submission",
    "is_final_submission": true,
    "created_at": "2024-02-15T10:00:00Z"
  }
}
```

**Note:** When `is_final_submission` is true, the project status automatically changes to "completed" and the client has 7 days to approve.

### 2. Approve Project (Client Only)
**POST** `/projects/{project_id}/approve/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "Project approved successfully",
  "project": {
    "id": 1,
    "client_approved_at": "2024-02-16T09:00:00Z"
  }
}
```

---

## Reporting & Moderation

### 1. Create Project Report
**POST** `/reports/create/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "reported_user": 1,
  "project": 1,
  "report_type": "inappropriate_behavior",
  "description": "The freelancer is not responding to messages and has missed the deadline without communication."
}
```

**Report Types:**
- "inappropriate_behavior"
- "spam"
- "fraud"
- "quality_issue"
- "payment_issue"
- "other"

**Response (201):**
```json
{
  "message": "Report submitted successfully",
  "report": {
    "id": 1,
    "reporter": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "reported_user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "project": {
      "id": 1,
      "title": "E-commerce Website Development"
    },
    "report_type": "inappropriate_behavior",
    "description": "The freelancer is not responding...",
    "status": "pending",
    "created_at": "2024-01-20T14:00:00Z"
  }
}
```

### 2. List All Reports (Admin Only)
**GET** `/admin/reports/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "reporter": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com"
    },
    "reported_user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "project": {
      "id": 1,
      "title": "E-commerce Website Development"
    },
    "report_type": "inappropriate_behavior",
    "description": "The freelancer is not responding to messages and has missed the deadline without communication.",
    "status": "pending",
    "assigned_admin": null,
    "admin_notes": null,
    "resolution": null,
    "resolved_at": null,
    "created_at": "2024-01-20T14:00:00Z",
    "updated_at": "2024-01-20T14:00:00Z"
  }
]
```

### 3. Get Report Details (Admin Only)
**GET** `/admin/reports/{report_id}/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
{
  "id": 1,
  "reporter": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com"
  },
  "reported_user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  },
  "project": {
    "id": 1,
    "title": "E-commerce Website Development",
    "client": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "awarded_freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    }
  },
  "report_type": "inappropriate_behavior",
  "description": "The freelancer is not responding to messages and has missed the deadline without communication.",
  "status": "pending",
  "assigned_admin": null,
  "admin_notes": null,
  "resolution": null,
  "resolved_at": null,
  "created_at": "2024-01-20T14:00:00Z",
  "updated_at": "2024-01-20T14:00:00Z"
}
```

### 4. Update Report Status (Admin Only)
**PUT** `/admin/reports/{report_id}/`

**Headers:** `Authorization: Token your_admin_token_here`

**Request Body:**
```json
{
  "status": "under_review",
  "admin_notes": "Investigating the reported issue. Will contact both parties for clarification.",
  "assigned_admin": 3
}
```

**Response (200):**
```json
{
  "message": "Report updated successfully",
  "report": {
    "id": 1,
    "status": "under_review",
    "admin_notes": "Investigating the reported issue. Will contact both parties for clarification.",
    "assigned_admin": {
      "id": 3,
      "first_name": "Admin",
      "last_name": "User"
    },
    "updated_at": "2024-01-21T10:00:00Z"
  }
}
```

---

## Admin Management

### 1. Get Admin Reviews
**GET** `/admin/reviews/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "freelancer"
    },
    "status": "pending",
    "admin_notes": null,
    "reviewed_by": null,
    "reviewed_at": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2. Get Admin Review Detail
**GET** `/admin/reviews/{review_id}/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
{
  "id": 1,
  "freelancer": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "user_type": "freelancer",
    "freelancer_profile": {
      "id": 1,
      "skills": ["Python", "Django", "React"],
      "github_profile": "https://github.com/johndoe",
      "portfolio_links": ["https://johndoe.dev"],
      "experience_description": "5 years of web development experience",
      "education": "Computer Science Degree",
      "is_verified": false,
      "is_pending_review": true
    }
  },
  "status": "pending",
  "admin_notes": null,
  "reviewed_by": null,
  "reviewed_at": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 3. Update Admin Review
**PUT** `/admin/reviews/{review_id}/update/`

**Headers:** `Authorization: Token your_admin_token_here`

**Request Body:**
```json
{
  "status": "approved",
  "admin_notes": "Excellent portfolio and experience. Approved for platform access."
}
```

**Response (200):**
```json
{
  "message": "Review updated successfully",
  "review": {
    "id": 1,
    "status": "approved",
    "admin_notes": "Excellent portfolio and experience. Approved for platform access.",
    "reviewed_by": {
      "id": 3,
      "first_name": "Admin",
      "last_name": "User"
    },
    "reviewed_at": "2024-01-16T10:30:00Z"
  }
}
```

### 4. Get Pending Freelancers
**GET** `/admin/freelancers/pending/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "freelancer"
    },
    "skills": ["Python", "Django", "React"],
    "github_profile": "https://github.com/johndoe",
    "portfolio_links": ["https://johndoe.dev"],
    "experience_description": "5 years of web development experience",
    "education": "Computer Science Degree",
    "is_verified": false,
    "is_pending_review": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 5. Get Admin Notifications
**GET** `/admin/notifications/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "notification_type": "new_freelancer_application",
    "title": "New Freelancer Application",
    "message": "A new freelancer application has been submitted by John Doe (john@example.com).",
    "is_read": false,
    "related_object_id": 1,
    "related_object_type": "freelancer",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## Admin Analytics

### 1. Project Analytics
**GET** `/admin/analytics/projects/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
{
  "total_projects": 150,
  "active_projects": 45,
  "completed_projects": 95,
  "total_budget": "15000000.00",
  "average_project_duration": 28.5,
  "projects_by_category": {
    "Web Development": 80,
    "Mobile Development": 40,
    "Design": 30
  },
  "projects_by_status": {
    "Active": 45,
    "In Progress": 10,
    "Completed": 95
  }
}
```

### 2. Bid Analytics
**GET** `/admin/analytics/bids/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
{
  "total_bids": 450,
  "average_bid_amount": "125000.00",
  "bids_by_status": {
    "Submitted": 300,
    "Awarded": 95,
    "Rejected": 50,
    "Withdrawn": 5
  },
  "top_freelancers": [
    {
      "name": "John Doe",
      "bid_count": 25
    },
    {
      "name": "Jane Smith",
      "bid_count": 20
    }
  ]
}
```

### 3. User Analytics
**GET** `/admin/analytics/users/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
{
  "total_users": 500,
  "total_freelancers": 300,
  "total_clients": 200,
  "verified_freelancers": 250,
  "pending_freelancers": 50,
  "active_projects_count": 10,
  "completed_projects_count": 95
}
```

---

## Admin Monitoring

### 1. Monitor Chat Rooms
**GET** `/admin/monitor/chats/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Project Chat: E-commerce Website Development",
    "chat_type": "project_chat",
    "is_active": true,
    "participants": [...],
    "messages": [...],
    "created_at": "2024-01-15T13:00:00Z"
  }
]
```

### 2. Monitor Messages
**GET** `/admin/monitor/messages/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "chat_room": {
      "id": 1,
      "title": "Project Chat: E-commerce Website Development"
    },
    "sender": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "message_type": "text",
    "content": "Hello! I have a question...",
    "is_deleted": false,
    "created_at": "2024-01-15T13:10:00Z"
  }
]
```

### 3. Monitor Projects
**GET** `/admin/monitor/projects/`

**Headers:** `Authorization: Token your_admin_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "E-commerce Website Development",
    "client": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@company.com"
    },
    "awarded_freelancer": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "status": "in_progress",
    "project_type": "public",
    "budget": "150000.00",
    "duration_days": 30,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T13:00:00Z",
    "awarded_at": "2024-01-15T13:00:00Z",
    "bid_count": 5,
    "files_count": 3,
    "messages_count": 12,
    "reports_count": 0
  },
  {
    "id": 2,
    "title": "Mobile App Development",
    "client": {
      "id": 3,
      "first_name": "Mike",
      "last_name": "Johnson",
      "email": "mike@techcorp.com"
    },
    "awarded_freelancer": null,
    "status": "active",
    "project_type": "public",
    "budget": "200000.00",
    "duration_days": 45,
    "created_at": "2024-01-16T09:00:00Z",
    "updated_at": "2024-01-16T09:00:00Z",
    "awarded_at": null,
    "bid_count": 8,
    "files_count": 1,
    "messages_count": 0,
    "reports_count": 0
  }
]
```

### 4. Delete Message (Admin Only)
**POST** `/messages/{message_id}/delete/`

**Headers:** `Authorization: Token your_admin_token_here`

**Request Body:**
```json
{
  "deletion_reason": "Inappropriate language and harassment"
}
```

**Response (200):**
```json
{
  "message": "Message deleted successfully"
}
```

### 5. Issue User Warning (Admin Only)
**POST** `/admin/warnings/create/`

**Headers:** `Authorization: Token your_admin_token_here`

**Request Body:**
```json
{
  "user": 1,
  "warning_type": "inappropriate_behavior",
  "message": "Your message in the project chat was inappropriate. Please maintain professional communication.",
  "related_project": 1,
  "related_message": 1
}
```

**Response (201):**
```json
{
  "message": "Warning issued successfully",
  "warning": {
    "id": 1,
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
    },
    "issued_by": {
      "id": 3,
      "first_name": "Admin",
      "last_name": "User"
    },
    "warning_type": "inappropriate_behavior",
    "message": "Your message in the project chat was inappropriate...",
    "created_at": "2024-01-20T15:00:00Z"
  }
}
```

---

## Notifications

### 1. Get User Notifications
**GET** `/notifications/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
[
  {
    "id": 1,
    "notification_type": "new_bid_received",
    "title": "New Bid Received",
    "message": "You have received a new bid from John Doe for project \"E-commerce Website Development\".",
    "is_read": false,
    "related_object_id": 1,
    "related_object_type": "bid",
    "created_at": "2024-01-15T12:00:00Z"
  }
]
```

### 2. Mark Notification as Read
**PUT** `/notifications/{notification_id}/`

**Headers:** `Authorization: Token your_auth_token_here`

**Request Body:**
```json
{
  "is_read": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "is_read": true,
  "updated_at": "2024-01-15T12:30:00Z"
}
```

### 3. Mark All Notifications as Read
**POST** `/notifications/mark-all-read/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

---

## Utility Endpoints

### 1. Check Email Exists
**GET** `/check-email/`

**Query Parameters:**
- `email`: The email address to check

**Example:** `/check-email/?email=john@example.com`

**Response (200):**
```json
{
  "exists": true,
  "message": "Email already exists"
}
```

**Response (200) - Email doesn't exist:**
```json
{
  "exists": false,
  "message": "Email is available"
}
```

### 2. Get User Status
**GET** `/user-status/`

**Headers:** `Authorization: Token your_auth_token_here`

**Response (200):**
```json
{
  "user_id": 1,
  "user_type": "freelancer",
  "is_authenticated": true,
  "profile_status": {
    "is_verified": false,
    "is_pending_review": true,
    "has_completed_profile": true
  },
  "permissions": {
    "can_bid": false,
    "can_post_projects": false,
    "can_access_admin": false
  }
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation error",
  "details": {
    "email": ["This field is required."],
    "password": ["This password is too short."]
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
  "error": "You do not have permission to perform this action."
}
```

**404 Not Found:**
```json
{
  "error": "Not found."
}
```

**500 Internal Server Error:**
```json
{
  "error": "A server error occurred."
}
```

### Validation Error Examples

**Project Creation Validation:**
```json
{
  "budget": ["Budget must be greater than 0"],
  "duration_days": ["Duration must be greater than 0 days"]
}
```

**Bid Creation Validation:**
```json
{
  "proposed_price": ["Proposed price must be greater than 0"],
  "timeline_days": ["Timeline must be greater than 0 days"]
}
```

---

## Data Models

### User Model
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "user_type": "freelancer",
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### Project Model
```json
{
  "id": 1,
  "client": {...},
  "title": "E-commerce Website Development",
  "description": "Project description",
  "category": {...},
  "required_skills": ["Python", "Django"],
  "budget": "150000.00",
  "duration_days": 30,
  "status": "active",
  "project_type": "public",
  "location": "Remote",
  "awarded_freelancer": null,
  "awarded_at": null,
  "completed_at": null,
  "client_approved_at": null,
  "client_approval_deadline": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Bid Model
```json
{
  "id": 1,
  "project": {...},
  "freelancer": {...},
  "proposed_price": "120000.00",
  "timeline_days": 25,
  "approach_methodology": "Detailed approach...",
  "cover_letter": "Cover letter...",
  "questions_for_client": "Questions...",
  "status": "submitted",
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

---

## Frontend Implementation Tips

### 1. Authentication Flow
```javascript
// Store token after login
localStorage.setItem('authToken', response.data.token);

// Include token in all requests
const headers = {
  'Authorization': `Token ${localStorage.getItem('authToken')}`,
  'Content-Type': 'application/json'
};
```

### 2. File Upload Implementation
```javascript
const uploadFile = async (file, projectId, category) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_category', category);
  formData.append('description', 'File description');
  
  const response = await fetch(`/api/projects/${projectId}/files/upload/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    },
    body: formData
  });
  
  return response.json();
};
```

### 3. Real-time Notifications
```javascript
// Poll for new notifications every 30 seconds
setInterval(async () => {
  const response = await fetch('/api/notifications/', {
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    }
  });
  const notifications = await response.json();
  updateNotificationBadge(notifications.filter(n => !n.is_read).length);
}, 30000);
```

### 4. Project Status Management
```javascript
const getProjectStatusColor = (status) => {
  const colors = {
    'draft': 'gray',
    'active': 'blue',
    'in_progress': 'orange',
    'completed': 'green',
    'cancelled': 'red',
    'paused': 'yellow',
    'on_hold': 'purple'
  };
  return colors[status] || 'gray';
};
```

### 5. Bid Status Management
```javascript
const getBidStatusColor = (status) => {
  const colors = {
    'submitted': 'blue',
    'awarded': 'green',
    'rejected': 'red',
    'withdrawn': 'gray'
  };
  return colors[status] || 'gray';
};
```

---

## Important Notes

1. **Currency**: All monetary values are in NGN (Nigerian Naira)
2. **File Uploads**: Maximum file size is determined by Django settings (default 2.5MB)
3. **Authentication**: Token expires after 24 hours of inactivity
4. **Project Approval**: Clients have 7 days to approve completed projects
5. **Milestones**: Optional feature - only created if client requests
6. **Admin Access**: Requires `is_staff=True` and `is_superuser=True`
7. **File Categories**: Use exact strings as specified in the documentation
8. **Date Format**: All dates are in ISO 8601 format (UTC)
9. **Pagination**: Default page size is 10 items
10. **Search**: Case-insensitive search across title and description fields

This documentation covers all the endpoints and features of the AfroTask platform. The frontend team can use this to implement the complete user interface without any errors.