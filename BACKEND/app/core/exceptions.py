from fastapi import HTTPException, status

class FLEXException(HTTPException):
    """Base exception for FLEX application"""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class UserNotFoundError(FLEXException):
    """Raised when a user is not found"""
    def __init__(self, detail: str = "User not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class InvalidCredentialsError(FLEXException):
    """Raised when credentials are invalid"""
    def __init__(self, detail: str = "Invalid credentials"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

class UserAlreadyExistsError(FLEXException):
    """Raised when trying to create a user that already exists"""
    def __init__(self, detail: str = "User already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

class ActivityNotFoundError(FLEXException):
    """Raised when an activity is not found"""
    def __init__(self, detail: str = "Activity not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedAccessError(FLEXException):
    """Raised when user tries to access unauthorized resource"""
    def __init__(self, detail: str = "Unauthorized access"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class DatabaseError(FLEXException):
    """Raised when there's a database error"""
    def __init__(self, detail: str = "Database error"):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail) 