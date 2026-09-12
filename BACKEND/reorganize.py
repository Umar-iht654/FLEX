import os
import shutil
from pathlib import Path

def create_directory(path):
    """Create directory if it doesn't exist"""
    os.makedirs(path, exist_ok=True)

def move_file(source, destination):
    """Move file from source to destination"""
    if os.path.exists(source):
        shutil.move(source, destination)
        print(f"Moved: {source} -> {destination}")
    else:
        print(f"Warning: Source file not found: {source}")

def main():
    # Get the current directory
    current_dir = Path(__file__).parent
    
    # Define new directory structure
    new_dirs = [
        "app/config",
        "app/core",
        "app/models",
        "app/schemas",
        "app/services",
        "app/api/v1/endpoints",
        "scripts/migrations"
    ]
    
    # Create new directories
    for dir_path in new_dirs:
        create_directory(current_dir / dir_path)
    
    # Move configuration files
    move_file(
        current_dir / "config/database.py",
        current_dir / "app/config/database.py"
    )
    move_file(
        current_dir / "config/settings.py",
        current_dir / "app/config/settings.py"
    )
    
    # Move models
    move_file(
        current_dir / "models/user.py",
        current_dir / "app/models/user.py"
    )
    move_file(
        current_dir / "models/activity.py",
        current_dir / "app/models/activity.py"
    )
    move_file(
        current_dir / "models/recommendation.py",
        current_dir / "app/models/recommendation.py"
    )
    move_file(
        current_dir / "models/message.py",
        current_dir / "app/models/message.py"
    )
    
    # Move schemas
    move_file(
        current_dir / "schemas/user.py",
        current_dir / "app/schemas/user.py"
    )
    move_file(
        current_dir / "schemas/activity.py",
        current_dir / "app/schemas/activity.py"
    )
    move_file(
        current_dir / "schemas/recommendation.py",
        current_dir / "app/schemas/recommendation.py"
    )
    move_file(
        current_dir / "schemas/message.py",
        current_dir / "app/schemas/message.py"
    )
    
    # Move API endpoints
    move_file(
        current_dir / "api/auth.py",
        current_dir / "app/api/v1/endpoints/auth.py"
    )
    move_file(
        current_dir / "api/users.py",
        current_dir / "app/api/v1/endpoints/users.py"
    )
    move_file(
        current_dir / "api/activities.py",
        current_dir / "app/api/v1/endpoints/activities.py"
    )
    move_file(
        current_dir / "api/recommendations.py",
        current_dir / "app/api/v1/endpoints/recommendations.py"
    )
    move_file(
        current_dir / "api/messaging.py",
        current_dir / "app/api/v1/endpoints/messaging.py"
    )
    
    # Move API router
    move_file(
        current_dir / "api/router.py",
        current_dir / "app/api/v1/router.py"
    )
    
    # Move main application
    move_file(
        current_dir / "main.py",
        current_dir / "app/main.py"
    )
    
    # Move scripts
    move_file(
        current_dir / "scripts/init_db.py",
        current_dir / "scripts/init_db.py"
    )
    
    # Move root files
    move_file(
        current_dir / "requirements.txt",
        current_dir / "requirements.txt"
    )
    move_file(
        current_dir / ".env",
        current_dir / ".env"
    )
    move_file(
        current_dir / "README.md",
        current_dir / "README.md"
    )
    
    print("\nReorganization complete!")
    print("Please verify the new structure and check for any errors.")

if __name__ == "__main__":
    main() 