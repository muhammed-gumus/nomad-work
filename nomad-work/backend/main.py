from typing import Dict
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import requests
from pymongo import MongoClient
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# MongoDB connections
myclient1 = MongoClient(
    "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")
myclient2 = MongoClient(
    "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")

db1 = myclient1["Discover"]
db2 = myclient2["Users"]

# FastAPI app
app = FastAPI()

# CORS middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Kullanıcı bilgilerini depolamak için bir veri yapısı
users_db: Dict[str, dict] = {}


# Dependency to get the current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return username


@app.post("/register")
def add_user(user: dict):
    global users_db

    # user_id'yi otomatik olarak ata
    user_id = str(len(users_db) + 1)
    user['user_id'] = user_id

    # Hash the password before storing
    hashed_password = pwd_context.hash(user["password"])
    user["password"] = hashed_password

    # Kullanıcı bilgilerini depolayın
    users_db[user_id] = user
    new_collection = db2["User"]
    y = new_collection.insert_one({"users_db": users_db})

    user_name = user.get('username', '')
    print(f"User Information Received: {user}")
    print(f"Username: {user_name}")
    return {"user_name": user_name, "user_id": user_id}


@app.post("/login")
def login(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    # MongoDB üzerinde kullanıcı bilgilerini sorgula
    collection = db2["User"]
    user_data = collection.find_one(
        {"users_db.1.username": user_name}
    )

    if user_data and pwd_context.verify(password, user_data["users_db"]["1"]["password"]):
        user_id = user_data['users_db']['1']['user_id']
        return {"message": "Giriş başarıyla gerçekleşti", "user_name": user_name, "user_id": user_id}

    return {"message": "Kullanıcı adı veya şifre hatalı"}


# Get JWT token for authentication
@app.post("/token")
def login_for_token(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    user_data = collection.find_one({"users_db.1.username": user_name})
    if user_data and password_hashing.verify(password, user_data["password"]):
        user_id = user_data['users_db']['1']['user_id']
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_jwt_token({"sub": user_id}, expires_delta)
        return {"access_token": jwt_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=401,
        detail="Invalid username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

# Example protected endpoint using JWT for authentication


@app.get("/users", response_model=dict)
def get_users(current_user: str = Depends(get_current_user)):
    return {"user_id": current_user}


@app.get("/cafe")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=coffee&type=cafe&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")

    if response.ok:
        data = response.json()
        new_collection = db1["Restaurant"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/restaurant")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=konya&type=restaurant&location=37.8746429%2C32.4931554&radius=15000&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        new_collection = db1["Cafe"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/library")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kütüphane&type=library&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    if response.ok:
        data = response.json()
        new_collection = db1["Library"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


# @app.get("/bakery")
# def discover():
#     response = requests.get(
#         f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=market&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
#     print(response)
#     if response.ok:
#         data = response.json()
#         print(data)
#     return data
