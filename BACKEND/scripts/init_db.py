import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_db():
    """Initialize the PostgreSQL database"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (os.getenv("DB_NAME"),))
        exists = cursor.fetchone()

        if not exists:
            # Create database
            cursor.execute(f'CREATE DATABASE {os.getenv("DB_NAME")}')
            print(f"Database {os.getenv('DB_NAME')} created successfully")
        else:
            print(f"Database {os.getenv('DB_NAME')} already exists")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db() 