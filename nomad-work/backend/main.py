from fastapi import FastAPI, HTTPException, Depends
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import Dict
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import MONGO_URI, GMAIL_SENDER_EMAIL, GMAIL_SENDER_PASSWORD
# MongoDB connections
myclient = MongoClient("mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")

db1 = myclient["Discover"]
db2 = myclient["Users"]

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

# # Endpoint isimleri ve bölge koordinatları
# endpoints = {
#     "cafe": {"keyword": "coffee", "type": "cafe", "radius": 1500},
#     "restaurant": {"keyword": "konya", "type": "restaurant", "radius": 1500},
#     "library": {"keyword": "kütüphane", "type": "library", "radius": 1500},
#     # Diğer alanlar eklenmeli...
# }

# # MongoDB koleksiyon adları
# collection_names = ["area1", "area2", "area3", "area4",
#                     "area5", "area6", "area7", "area8", "area9", "area10"]

# # Konya koordinatları
# konya_coords = (37.8746429, 32.4931554)

# # Endpoint'leri işleyen fonksiyon


# def process_endpoint(endpoint_name, keyword, place_type, radius, center_coords):
#     # Konya bölgesini 10'a bölerek istekleri yap
#     for i in range(1, 11):
#         start_angle = (i - 1) * 36
#         end_angle = i * 36
#         endpoint_coords = generate_coords(
#             center_coords, start_angle, end_angle)

#         for j in range(10):
#             response = requests.get(
#                 f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword={keyword}&type={place_type}&location={endpoint_coords[0]}%2C{endpoint_coords[1]}&radius={radius}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")

#             if response.ok:
#                 data = response.json()
#                 if data.get("status") == "OK":
#                     new_collection = db1[collection_names[i - 1]]
#                     x = new_collection.insert_one({"data": data})
#                 else:
#                     print(
#                         f"No results for endpoint {endpoint_name}, area {i}, attempt {j + 1}")
#             else:
#                 print(
#                     f"Error in request for endpoint {endpoint_name}, area {i}, attempt {j + 1}. Status code: {response.status_code}")

# Koordinatları hesaplayan yardımcı fonksiyon


# def generate_coords(center_coords, start_angle, end_angle):
#     radius = 15000  # Mesela, 15000 metre yarıçapında bir alan alıyoruz
#     center_lat, center_lon = center_coords

#     # Hesaplamaları yap ve yeni koordinatları döndür
#     # Bu örnek, basit bir hesaplama olabilir ve geliştirilmeye açık olabilir
#     # Ayrıca, dönüşü yapılacak koordinatların uygun bir format içinde olması önemlidir
#     new_lat = center_lat + radius * 0.000008983 * (start_angle + end_angle) / 2
#     new_lon = center_lon + radius * 0.000008983 * (start_angle + end_angle) / 2

#     return new_lat, new_lon

# # Her bir endpoint için işlem yap
# for endpoint_name, endpoint_data in endpoints.items():
#     process_endpoint(
#         endpoint_name, endpoint_data["keyword"], endpoint_data["type"], endpoint_data["radius"], konya_coords)

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
    # Şifreyi depolamadan önce hashle
    hashed_password = pwd_context.hash(user["password"])
    user["password"] = hashed_password

    # Her kullanıcı için yeni bir belge oluştur
    new_collection = db2["User"]
    try:
        result = new_collection.insert_one(user)
        user_id = str(result.inserted_id)
        user_name = user.get('username', '')
        print(f"Kullanıcı Bilgisi Alındı: {user}")
        print(f"Kullanıcı Adı: {user_name}")
        return {"user_name": user_name, "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
def login(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    # MongoDB üzerinde kullanıcı bilgilerini sorgula
    collection = db2["User"]
    user_data = collection.find_one({"username": user_name})

    if user_data and pwd_context.verify(password, user_data["password"]):
        user_id = str(user_data['_id'])
        print(f"MongoDB'den Gelen Kullanıcı Bilgisi: {user_data}")
        return {"message": "Giriş başarıyla gerçekleşti", "user_name": user_name, "user_id": user_id}

    return {"message": "Kullanıcı adı veya şifre hatalı"}

# Get JWT token for authentication


@app.post("/token")
def login_for_token(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    collection = db2["User"]
    user_data = collection.find_one({"username": user_name})

    if user_data and pwd_context.verify(password, user_data["password"]):
        user_id = str(user_data['_id'])
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_jwt_token({"sub": user_id}, expires_delta)
        return {"access_token": jwt_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=401,
        detail="Geçersiz kullanıcı adı veya şifre",
        headers={"WWW-Authenticate": "Bearer"},
    )
# Example protected endpoint using JWT for authentication


@app.get("/users", response_model=dict)
def get_users(current_user: str = Depends(get_current_user)):
    return {"user_id": current_user}


@app.get("/cafe")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=coffee&type=cafe&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")

    if response.ok:
        data = response.json()
        new_collection = db1["Cafe"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/restaurant")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=konya&type=restaurant&location=37.8746429%2C32.4931554&radius=15000&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")
    print(response)
    if response.ok:
        data = response.json()
        new_collection = db1["Restaurant"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/library")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kütüphane&type=library&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")
    if response.ok:
        data = response.json()
        new_collection = db1["Library"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
    return data


# E-posta gönderme fonksiyonu
def send_email(receiver_email, subject, body):
    
    

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            sender_email = GMAIL_SENDER_EMAIL
            sender_password = GMAIL_SENDER_PASSWORD

            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            message["Subject"] = subject

            message.attach(MIMEText(body, "plain"))
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            print("E-posta gönderildi.")
            error_code = e.smtp_code
            error_message = e.smtp_error
            print(error_message)


@app.post("/send-email")
def send_user_email(user_info: dict):
    receiver_email = "mr.silver.mg@gmail.com"  # E-postayı alacak adres
    subject = "Konu: İletişim Formu"
    body = f"Ad: {user_info.get('firstName', '')}\nSoyad: {user_info.get('lastName', '')}\nKullanıcı Adı: {user_info.get('username', '')}\nE-posta: {user_info.get('email', '')}\nMesaj: {user_info.get('text', '')}"

    send_email(receiver_email, subject, body)

    return {"message": "E-posta gönderildi"}
