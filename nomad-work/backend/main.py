from fastapi import Depends
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
from typing import Union

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.classify.scikitlearn import SklearnClassifier
from sklearn.naive_bayes import MultinomialNB
import random
from googletrans import Translator
import time


# MongoDB connections
myclient = MongoClient(
    "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")

db1 = myclient["Discover"]
db2 = myclient["Users"]
db3 = myclient["Mails"]
db4 = myclient["Comments"]


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
SECRET_KEY = "veryStrongKey!"
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

def check_existing_user(email: str, username: str):
    collection = db2["User"]
    existing_email = collection.find_one({"email": email})
    existing_username = collection.find_one({"username": username})

    if existing_email or existing_username:
        return True  # User already exists
    else:
        return False

# User registration endpoint

# Veri setini yükleme
data = pd.read_csv('yorumlar.csv', usecols=['Review Text', 'Rating'])

# Metin ön işleme fonksiyonu
def preprocess_text(text):
    # Küçük harfe dönüştürme
    text = text.lower()
    # Özel karakterleri temizleme
    text = ''.join(char for char in text if char.isalnum() or char.isspace())
    return text

# Küçük bir veri örneği oluşturma
data = data.sample(frac=0.1, random_state=42)

# Metin ön işleme ve model oluşturma
X = data['Review Text'].apply(preprocess_text)
y = data['Rating']

# Veri setini eğitim ve test setlerine ayırma
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline oluşturma
pipeline = Pipeline([
    ('vect', TfidfVectorizer(ngram_range=(1, 2))),
    ('clf', LinearSVC())
])

# Modeli eğitme
pipeline.fit(X_train, y_train)

@app.post("/rating")
def predict_rating(comment_data: dict):
    try:
        # Gelen dictionary içindeki "comment" anahtarından yorumu al
        comment = comment_data.get("comment", "")
        
        # Yorumun önişlenmesi
        preprocessed_comment = preprocess_text(comment)
        
        # Tahmin yapma
        predicted_rating = pipeline.predict([preprocessed_comment])[0]
        
        # Tahmin edilen rating'i dictionary içine ekleyerek döndür
        return {"predicted_rating": str(predicted_rating)}  # Tahmin edilen rating'i string olarak dönüştür
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.post("/register")
def add_user(user: dict):
    # Check if the email or username already exists
    if check_existing_user(user["email"], user["username"]):
        raise HTTPException(
            status_code=400, detail="Email or username already exists")

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


def create_jwt_token(data: dict, expires_delta: Union[timedelta, None] = None):

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


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


@app.get("/comments")
def get_comments():
    try:
        # MongoDB'den tüm yorumları al
        comments_collection = db4["Comment"]
        comments = comments_collection.find({}, {"_id": 0})

        # Yorumları liste halinde döndür
        return list(comments)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Yorumları kaydetmek için yeni endpoint


@app.post("/comments")
def add_comment(comment_data: dict):
    try:
        # Gelen dictionary içindeki "comment" anahtarından yorumu al
        comment = comment_data.get("comment", "")
        # Gelen dictionary içindeki "place_name" anahtarından yer ismini al
        place_name = comment_data.get("place_name", "")
        # Gelen dictionary içindeki "username" anahtarından kullanıcı adını al
        username = comment_data.get("username", "")

        # Tahmin edilen rating'i almak için rating endpointini çağır
        predicted_rating_response = predict_rating(comment_data)
        predicted_rating = predicted_rating_response.get("predicted_rating", None)

        # MongoDB'ye yorumu ve ratingi ekleyin
        new_collection = db4["Comment"]
        result = new_collection.insert_one({
            "place_name": place_name,
            "username": username,
            "comment": comment,
            "rating": predicted_rating,  # Tahmin edilen rating'i kaydet
            "timestamp": datetime.utcnow()
        })

        comment_id = str(result.inserted_id)
        print(f"Yorum Başarıyla Kaydedildi: {comment}")
        return {"comment_id": comment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



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
    try:
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
    except smtplib.SMTPException as e:
        print("E-posta gönderme hatası:", e)


@app.post("/send-email")
def send_user_email(user_info: dict):
    new_user = {
        "username": user_info.get("username", ""),
        "email": user_info.get("email", ""),
        "message": user_info.get("text", ""),
        # You can add other user information
    }

    try:
        new_collection = db3["Mails"]  # Define the collection
        result = new_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        user_name = new_user.get("username", "")
        print(f"User Information Received: {new_user}")
        print(f"User Name: {user_name}")
        return {"user_name": user_name, "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ...


# @app.post("/comments")
# def add_comment(comment_data: dict):
#     comment = comment_data.get("comment", "")
#     username = comment_data.get("username", "")
#     place_name = comment_data.get("place_name", "")

#     # MongoDB'ye yorumu ekleyin
#     new_collection = db4["Comment"]
#     try:
#         result = new_collection.insert_one({
#             "place_name": place_name,
#             "username": username,
#             "comment": comment,
#             "timestamp": datetime.utcnow()
#         })

#         comment_id = str(result.inserted_id)
#         print(f"Yorum Başarıyla Kaydedildi: {comment}")
#         return {"comment_id": comment_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))




# # Yorumları kaydetmek için yeni endpoint


# @app.get("/comments")
# def get_comments():
#     try:
#         # MongoDB'den tüm yorumları al
#         comments_collection = db4["Comment"]
#         comments = comments_collection.find({}, {"_id": 0})

#         # Yorumları liste halinde döndür
#         return list(comments)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # Yorumları kaydetmek için yeni endpoint


# # Kelimeleri ayıklama ve temizleme için NLTK'nin İngilizce durdurma kelimelerini kullanma
# def preprocess_text(text):
#     stop_words = set(stopwords.words('english'))
#     words = word_tokenize(text)
#     return [word.lower() for word in words if word.isalpha() and word.lower() not in stop_words]


# # Modeli eğitme
# def train_classifier():
#     data = pd.read_csv('yorumlar.csv')

#     documents = [(preprocess_text(row['Review Text']), row['Rating'])
#                  for _, row in data.iterrows()]
#     random.shuffle(documents)

#     all_words = nltk.FreqDist(
#         [word for (words, _) in documents for word in words])
#     word_features = list(all_words.keys())[:2000]

#     def document_features(document):
#         document_words = set(document)
#         features = {}
#         for word in word_features:
#             features[f'contains({word})'] = (word in document_words)
#         return features

#     featuresets = [(document_features(d), c) for (d, c) in documents]

#     classifier = SklearnClassifier(MultinomialNB())
#     classifier.train(featuresets)

#     return classifier


# classifier = train_classifier()


# @app.post("/comments")
# def add_comment(comment_data: dict):
#     comment = comment_data.get("comment", "")
#     username = comment_data.get("username", "")
#     place_name = comment_data.get("place_name", "")
#     print(comment, "orjin yorum")
#     print(type(comment))

#     try:
#         # Yorumu işleme
#         translated_comment = Translator().translate(comment, dest='en').text
#         preprocessed_comment = preprocess_text(translated_comment)
#         features = document_features(preprocessed_comment)
#         predicted_rating = classifier.classify(features)
#         print(predicted_rating, "rate")

#         # MongoDB'ye yorumu ekleme
#         new_collection = db4["Comment"]
#         result = new_collection.insert_one({
#             "place_name": place_name,
#             "username": username,
#             "comment": comment,
#             "predicted_rating": predicted_rating,
#             "timestamp": datetime.utcnow()
#         })

#         comment_id = str(result.inserted_id)
#         print(f"Yorum Başarıyla Kaydedildi: {comment}")
#         return {"comment_id": comment_id}
#     except Exception as e:
#         print(f"Yorum ekleme hatası: {e}")  # Hata detayını konsola yazdır
#         raise HTTPException(
#             status_code=500, detail="Yorum ekleme işlemi sırasında bir hata oluştu")
#     finally:
#         # Her istek arasında 2 saniye bekleyin
#         time.sleep(2)


# @app.post("/comments")
# def add_comment(comment_data: dict):
#     comment = comment_data.get("comment", "")
#     username = comment_data.get("username", "")
#     place_name = comment_data.get("place_name", "")

#     # MongoDB'ye yorumu ekleyin
#     new_collection = db4["Comment"]
#     try:
#         result = new_collection.insert_one({
#             "place_name": place_name,
#             "username": username,
#             "comment": comment,
#             "timestamp": datetime.utcnow()
#         })

#         comment_id = str(result.inserted_id)
#         print(f"Yorum Başarıyla Kaydedildi: {comment}")
#         return {"comment_id": comment_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


###############################################
###################    AI    ##################
###############################################

# # Veri setini yükleme
# data = pd.read_csv('yorumlar.csv')

# # Kelimeleri ayıklama ve temizleme
# stop_words = set(stopwords.words('english'))

# def preprocess_text(text):
#     words = word_tokenize(text)
#     return [word.lower() for word in words if word.isalpha() and word.lower() not in stop_words]

# # Veri setini işleme
# documents = [(preprocess_text(row['Review Text']), row['Rating']) for _, row in data.iterrows()]
# random.shuffle(documents)

# # Öznitelik çıkarma
# all_words = nltk.FreqDist([word for (words, _) in documents for word in words])
# word_features = list(all_words.keys())[:2000]

# def document_features(document):
#     document_words = set(document)
#     features = {}
#     for word in word_features:
#         features[f'contains({word})'] = (word in document_words)
#     return features

# featuresets = [(document_features(d), c) for (d,c) in documents]

# # Modeli eğitme
# classifier = SklearnClassifier(MultinomialNB())
# classifier.train(featuresets)

# # Kullanıcıdan yorum isteme ve çeviri yapma
# user_comment = input("Yorumunuzu girin: ")

# translator = Translator()
# translated_comment = translator.translate(user_comment, dest='en').text

# preprocessed_comment = preprocess_text(translated_comment)
# features = document_features(preprocessed_comment)
# predicted_rating = classifier.classify(features)

# # Tahmin edilen puanı ekrana yazdırma
# print("Yaptığınız yorum için tahmini puan:", predicted_rating)


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
