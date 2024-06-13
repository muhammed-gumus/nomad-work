# config.py

import os

MONGO_URI = "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority"
MONGO_DB_NAME = "Discover"

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

GMAIL_SENDER_EMAIL = "mr.silver.mg@gmail.com"
GMAIL_SENDER_PASSWORD = "Silver2001."
