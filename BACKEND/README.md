# FLEX Backend

This is the backend service for the FLEX application, built with FastAPI and PostgreSQL.

## Project Structure

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
│   │   ├── user.py
│   │   ├── activity.py
│   │   └── ...
│   │
│   ├── schemas/              # Pydantic schemas
│   │   ├── user.py
│   │   ├── activity.py
│   │   └── ...
│   │
│   ├── services/             # Business logic
│   │   ├── auth.py
│   │   ├── activity.py
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

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/flex_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flex_db
DB_USER=user
DB_PASSWORD=password
SECRET_KEY=your-secret-key
```

3. Initialize the database:
```bash
python scripts/init_db.py
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Use `scripts/init_db.py` to initialize the database
- Add new models in `app/models/`
- Add new schemas in `app/schemas/`
- Add new endpoints in `app/api/v1/endpoints/`
- Add new services in `app/services/` 