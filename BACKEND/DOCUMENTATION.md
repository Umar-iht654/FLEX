# FLEX Backend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Directory Structure](#directory-structure)
4. [Configuration Files](#configuration-files)
5. [Core Components](#core-components)
6. [Models](#models)
7. [Schemas](#schemas)
8. [Services](#services)
9. [API Endpoints](#api-endpoints)
10. [Development Guidelines](#development-guidelines)

## Project Overview
The FLEX backend is a FastAPI-based RESTful API service that provides functionality for:
- User authentication and authorization
- Activity management
- Activity recommendations
- User messaging
- Database operations with PostgreSQL

### Technology Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Validation**: Pydantic
- **Testing**: pytest
- **Documentation**: Swagger UI, ReDoc

## Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### Installation
1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/flex_db
   SECRET_KEY=your-secret-key
   ```
5. Initialize the database:
   ```bash
   python scripts/init_db.py
   ```
6. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

## Directory Structure
```
backend/
├── app/
│   ├── config/                 # Configuration files
│   │   ├── database.py        # Database configuration
│   │   ├── settings.py        # Application settings
│   │   └── auth.py           # Authentication configuration
│   │
│   ├── core/                  # Core application logic
│   │   ├── security.py       # Security utilities
│   │   └── exceptions.py     # Custom exceptions
│   │
│   ├── models/               # Database models
│   │   ├── user.py          # User model
│   │   ├── activity.py      # Activity model
│   │   └── ...
│   │
│   ├── schemas/              # Pydantic schemas
│   │   ├── user.py          # User schemas
│   │   ├── activity.py      # Activity schemas
│   │   └── ...
│   │
│   ├── services/             # Business logic
│   │   ├── auth.py          # Authentication service
│   │   ├── activity.py      # Activity service
│   │   └── ...
│   │
│   ├── api/                  # API endpoints
│   │   └── v1/
│   │       ├── endpoints/    # API endpoint handlers
│   │       └── router.py    # API router configuration
│   │
│   └── main.py              # Main application
│
├── scripts/                 # Utility scripts
│   ├── init_db.py          # Database initialization
│   └── migrations/         # Database migrations
│
├── tests/                  # Test files
├── .env                   # Environment variables
└── requirements.txt       # Python dependencies
```

## Configuration Files

### `app/config/settings.py`
Contains application-wide settings and configuration using Pydantic's BaseSettings.

**Example Usage:**
```python
from app.config.settings import get_settings

settings = get_settings()
db_url = settings.DATABASE_URL
```

**Key Components:**
- `Settings` class: Pydantic settings model for type-safe configuration
- Environment variables configuration with validation
- Database connection settings with connection pooling
- JWT settings for authentication
- CORS settings for frontend integration

**Environment Variables:**
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/flex_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flex_db
DB_USER=user
DB_PASSWORD=password

# JWT Configuration
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000"]
CORS_CREDENTIALS=True
CORS_METHODS=["*"]
CORS_HEADERS=["*"]
```

### `app/config/database.py`
Database configuration and session management using SQLAlchemy.

**Example Usage:**
```python
from app.config.database import get_db, SessionLocal

# Dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Direct usage
db = SessionLocal()
users = db.query(User).all()
```

**Key Components:**
- SQLAlchemy engine configuration with connection pooling
- Session factory setup for database sessions
- Database session dependency for FastAPI
- Connection pooling settings for performance

**Connection Pool Settings:**
```python
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,          # Number of connections to keep open
    max_overflow=10,      # Number of connections to create above pool_size
    pool_timeout=30,      # Seconds to wait before giving up
    pool_recycle=1800,    # Recycle connections after 30 minutes
)
```

### `app/config/auth.py`
Authentication configuration for JWT and password hashing.

**Example Usage:**
```python
from app.config.auth import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create token
token = create_access_token(
    data={"sub": user.email},
    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
)
```

**Key Components:**
- JWT configuration for token generation and validation
- Password hashing settings using bcrypt
- Security headers for HTTP responses
- Token types for different authentication scenarios

## Core Components

### `app/core/security.py`
Security utilities and functions for authentication and authorization.

**Example Usage:**
```python
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)

# Hash password
hashed_password = get_password_hash("user_password")

# Verify password
is_valid = verify_password("user_password", hashed_password)

# Create token
token = create_access_token(data={"sub": user.email})
```

**Key Functions:**
- `verify_password(plain_password, hashed_password)`: Verify password against hash
- `get_password_hash(password)`: Generate secure password hash
- `create_access_token(data, expires_delta)`: Create JWT token
- `verify_token(token)`: Verify JWT token validity

### `app/core/exceptions.py`
Custom exception classes for consistent error handling.

**Example Usage:**
```python
from app.core.exceptions import UserNotFoundError

try:
    user = get_user(user_id)
except UserNotFoundError as e:
    return {"error": str(e)}
```

**Exception Classes:**
- `FLEXException`: Base exception for all custom exceptions
- `UserNotFoundError`: Raised when user is not found (404)
- `InvalidCredentialsError`: Raised for invalid credentials (401)
- `UserAlreadyExistsError`: Raised when creating duplicate user (409)
- `ActivityNotFoundError`: Raised when activity is not found (404)
- `UnauthorizedAccessError`: Raised for unauthorized access (403)
- `DatabaseError`: Raised for database errors (500)

## Models

### `app/models/user.py`
SQLAlchemy model for user data.

**Example Usage:**
```python
from app.models.user import User

# Create user
user = User(
    email="user@example.com",
    hashed_password=get_password_hash("password"),
    full_name="John Doe"
)

# Query user
user = db.query(User).filter(User.email == "user@example.com").first()
```

**Attributes:**
- `id`: Primary key (auto-incrementing integer)
- `email`: Unique user email (string)
- `hashed_password`: Securely hashed password (string)
- `full_name`: User's full name (string)
- `username`: Optional username (string, nullable)
- `created_at`: Creation timestamp (datetime)
- `updated_at`: Update timestamp (datetime)

### `app/models/activity.py`
SQLAlchemy model for activity data.

**Example Usage:**
```python
from app.models.activity import Activity

# Create activity
activity = Activity(
    title="Morning Run",
    description="5km run in the park",
    activity_type="running",
    start_time=datetime.now(),
    end_time=datetime.now() + timedelta(hours=1),
    user_id=current_user.id
)

# Query activities
activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
```

**Attributes:**
- `id`: Primary key
- `title`: Activity title
- `description`: Activity description
- `activity_type`: Type of activity
- `location`: Activity location
- `start_time`: Start time
- `end_time`: End time
- `max_participants`: Maximum participants
- `is_public`: Public/private flag
- `user_id`: Creator's ID (foreign key)
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### `app/models/recommendation.py`
Recommendation model definition.

**Attributes:**
- `id`: Primary key
- `title`: Recommendation title
- `description`: Recommendation description
- `activity_type`: Type of activity
- `reason`: Recommendation reason
- `priority`: Priority level
- `user_id`: User's ID
- `is_completed`: Completion status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### `app/models/message.py`
Message model definition.

**Attributes:**
- `id`: Primary key
- `content`: Message content
- `sender_id`: Sender's ID
- `receiver_id`: Receiver's ID
- `is_read`: Read status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

## Schemas

### `app/schemas/user.py`
User-related Pydantic schemas.

**Schemas:**
- `UserBase`: Base user schema
- `UserCreate`: User creation schema
- `UserUpdate`: User update schema
- `UserResponse`: User response schema
- `Token`: Authentication token schema
- `TokenData`: Token data schema

### `app/schemas/activity.py`
Activity-related Pydantic schemas.

**Schemas:**
- `ActivityBase`: Base activity schema
- `ActivityCreate`: Activity creation schema
- `ActivityUpdate`: Activity update schema
- `ActivityResponse`: Activity response schema
- `ActivityList`: Paginated activity list

### `app/schemas/recommendation.py`
Recommendation-related Pydantic schemas.

**Schemas:**
- `RecommendationBase`: Base recommendation schema
- `RecommendationCreate`: Recommendation creation schema
- `RecommendationUpdate`: Recommendation update schema
- `RecommendationResponse`: Recommendation response schema
- `RecommendationList`: Paginated recommendation list

### `app/schemas/message.py`
Message-related Pydantic schemas.

**Schemas:**
- `MessageBase`: Base message schema
- `MessageCreate`: Message creation schema
- `MessageUpdate`: Message update schema
- `MessageResponse`: Message response schema
- `Conversation`: Conversation schema
- `MessageList`: Paginated message list

## Services

### `app/services/auth.py`
Authentication service.

**Methods:**
- `authenticate_user()`: Authenticate user
- `create_user()`: Create new user
- `create_access_token_for_user()`: Create access token

### `app/services/activity.py`
Activity management service.

**Methods:**
- `get_activity()`: Get activity by ID
- `get_user_activities()`: Get user's activities
- `create_activity()`: Create new activity
- `update_activity()`: Update activity
- `delete_activity()`: Delete activity

### `app/services/recommendation.py`
Recommendation service.

**Methods:**
- `get_user_recommendations()`: Get user's recommendations
- `create_recommendation()`: Create new recommendation
- `delete_recommendation()`: Delete recommendation
- `get_recommendation_by_id()`: Get recommendation by ID

### `app/services/messaging.py`
Messaging service.

**Methods:**
- `get_user_messages()`: Get user's messages
- `get_conversation()`: Get conversation between users
- `send_message()`: Send new message
- `delete_message()`: Delete message
- `get_message_by_id()`: Get message by ID

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/auth/login`: User login
- `POST /api/v1/auth/register`: User registration

### User Endpoints
- `GET /api/v1/users/me`: Get current user
- `PUT /api/v1/users/me`: Update current user
- `DELETE /api/v1/users/me`: Delete current user

### Activity Endpoints
- `GET /api/v1/activities`: Get activities
- `POST /api/v1/activities`: Create activity
- `GET /api/v1/activities/{id}`: Get activity by ID
- `PUT /api/v1/activities/{id}`: Update activity
- `DELETE /api/v1/activities/{id}`: Delete activity

### Recommendation Endpoints
- `GET /api/v1/recommendations`: Get recommendations
- `POST /api/v1/recommendations`: Create recommendation
- `GET /api/v1/recommendations/{id}`: Get recommendation by ID
- `DELETE /api/v1/recommendations/{id}`: Delete recommendation

### Messaging Endpoints
- `GET /api/v1/messages`: Get messages
- `POST /api/v1/messages`: Send message
- `GET /api/v1/messages/{id}`: Get message by ID
- `DELETE /api/v1/messages/{id}`: Delete message
- `GET /api/v1/messages/conversation/{user_id}`: Get conversation

## Development Guidelines

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all function parameters and return values
- Document all public functions and classes
- Keep functions small and focused
- Use meaningful variable and function names

### Testing
- Write unit tests for all new functionality
- Use pytest for testing
- Maintain test coverage above 80%
- Test both success and failure cases

### Security
- Never store plain text passwords
- Use environment variables for sensitive data
- Validate all user input
- Implement proper error handling
- Use HTTPS in production

### Performance
- Use connection pooling
- Implement proper indexing
- Cache frequently accessed data
- Optimize database queries
- Use pagination for large datasets

### Deployment
- Use Docker for containerization
- Implement CI/CD pipeline
- Monitor application performance
- Set up proper logging
- Implement backup strategy

### API Design
- Follow RESTful principles
- Use consistent naming conventions
- Version your API
- Document all endpoints
- Handle errors gracefully

### Database
- Use migrations for schema changes
- Implement proper indexing
- Normalize data where appropriate
- Use transactions for data integrity
- Implement proper backup strategy

## Database Layer

### Why SQLAlchemy?

SQLAlchemy is used in this project for several important reasons:

1. **Object-Relational Mapping (ORM)**
   - Maps Python classes to database tables
   - Allows working with database objects using Python code
   - Reduces the need for raw SQL queries
   - Example:
     ```python
     # Instead of writing SQL:
     # SELECT * FROM users WHERE email = 'user@example.com'
     
     # We can write Python:
     user = db.query(User).filter(User.email == 'user@example.com').first()
     ```

2. **Database Abstraction**
   - Works with multiple database backends (PostgreSQL, MySQL, SQLite)
   - Easy to switch databases if needed
   - Handles database-specific SQL differences
   - Example:
     ```python
     # Same code works for different databases
     engine = create_engine(
         "postgresql://user:pass@localhost/db"  # PostgreSQL
         # "mysql://user:pass@localhost/db"     # MySQL
         # "sqlite:///./sql_app.db"            # SQLite
     )
     ```

3. **Type Safety**
   - Provides type checking for database operations
   - Catches errors at development time
   - Improves code reliability
   - Example:
     ```python
     class User(Base):
         id: int = Column(Integer, primary_key=True)
         email: str = Column(String, unique=True)
         # Type errors caught by IDE/type checker
         # user.email = 123  # Error: Expected str, got int
     ```

4. **Query Building**
   - Powerful query construction
   - Supports complex joins and relationships
   - Chainable query methods
   - Example:
     ```python
     # Complex query in readable Python
     activities = (
         db.query(Activity)
         .join(User)
         .filter(Activity.user_id == current_user.id)
         .filter(Activity.is_public == True)
         .order_by(Activity.created_at.desc())
         .limit(10)
         .all()
     )
     ```

5. **Session Management**
   - Handles database connections
   - Manages transactions
   - Provides connection pooling
   - Example:
     ```python
     # Automatic transaction management
     try:
         user = User(email="user@example.com")
         db.add(user)
         db.commit()  # Transaction committed
     except Exception:
         db.rollback()  # Transaction rolled back on error
     ```

6. **Relationship Management**
   - Handles foreign key relationships
   - Supports one-to-many, many-to-many relationships
   - Automatic relationship loading
   - Example:
     ```python
     class User(Base):
         activities = relationship("Activity", back_populates="user")
     
     class Activity(Base):
         user = relationship("User", back_populates="activities")
     
     # Easy access to related objects
     user_activities = user.activities
     activity_creator = activity.user
     ```

7. **Migration Support**
   - Works with Alembic for database migrations
   - Tracks schema changes
   - Provides version control for database
   - Example:
     ```bash
     # Generate migration
     alembic revision --autogenerate -m "Add user table"
     
     # Apply migration
     alembic upgrade head
     ```

8. **Performance Features**
   - Connection pooling
   - Query optimization
   - Lazy loading
   - Caching
   - Example:
     ```python
     # Connection pooling
     engine = create_engine(
         DATABASE_URL,
         pool_size=5,
         max_overflow=10,
         pool_timeout=30
     )
     ```

9. **Security**
   - Built-in SQL injection protection
   - Parameterized queries
   - Safe string escaping
   - Example:
     ```python
     # SQLAlchemy handles SQL injection protection
     # This is safe:
     user = db.query(User).filter(User.email == user_input).first()
     
     # Instead of unsafe:
     # db.execute(f"SELECT * FROM users WHERE email = '{user_input}'")
     ```

10. **Integration with FastAPI**
    - Seamless integration with FastAPI's dependency injection
    - Async support
    - Easy to use in FastAPI routes
    - Example:
      ```python
      @app.get("/users/{user_id}")
      def get_user(user_id: int, db: Session = Depends(get_db)):
          user = db.query(User).filter(User.id == user_id).first()
          return user
      ```

### When to Use Raw SQL

While SQLAlchemy provides many benefits, there are cases where raw SQL might be preferred:

1. **Complex Queries**
   - When queries are too complex for ORM
   - Need database-specific features
   - Performance-critical operations

2. **Database-Specific Features**
   - Using PostgreSQL-specific functions
   - Advanced indexing features
   - Custom database functions

3. **Performance Optimization**
   - Fine-tuning query performance
   - Using database-specific optimizations
   - Bulk operations

Example of raw SQL usage:
```python
# Complex query using raw SQL
result = db.execute("""
    WITH user_activities AS (
        SELECT user_id, COUNT(*) as activity_count
        FROM activities
        GROUP BY user_id
    )
    SELECT u.*, ua.activity_count
    FROM users u
    LEFT JOIN user_activities ua ON u.id = ua.user_id
    WHERE ua.activity_count > 10
""")
``` 