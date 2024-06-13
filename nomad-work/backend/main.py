from fastapi import FastAPI, HTTPException, Depends
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import Dict
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import MONGO_URI, GMAIL_SENDER_EMAIL, GMAIL_SENDER_PASSWORD
from typing import Union
import string
from deep_translator import GoogleTranslator
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
from sklearn.metrics import accuracy_score
import random
import time
import requests

myclient = MongoClient(
    "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")

db1 = myclient["Discover"]
db2 = myclient["Users"]
db3 = myclient["Mails"]
db4 = myclient["Comments"]

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "veryStrongKey!"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

users_db: Dict[str, dict] = {}


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
        return True
    else:
        return False


nltk.download('stopwords')
stop_words = set(stopwords.words('english'))
stemmer = SnowballStemmer("english")


def preprocess_text(text):
    text = text.lower()
    words = text.split()
    words = [stemmer.stem(word)
             for word in words if word not in stop_words and word.isalpha()]
    return ' '.join(words)


data = pd.read_csv('/Users/muhammedgumus/Desktop/nomad/nomad-work/nomad-work/backend/yorumlar.csv',
                   usecols=['Review Text', 'Rating'])
data = data.sample(frac=1, random_state=42)

X = data['Review Text'].apply(preprocess_text)
y = data['Rating']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

pipeline_svc = Pipeline([
    ('vect', TfidfVectorizer(ngram_range=(1, 2))),
    ('clf', LinearSVC())
])

pipeline_svc.fit(X_train, y_train)

y_pred = pipeline_svc.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Doğruluğu: {accuracy * 100:.2f}%")


def translate_text(text, source_language="tr", target_language="en"):
    try:
        translated_text = GoogleTranslator(
            source=source_language, target=target_language).translate(text)
        return translated_text
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Translation error: {str(e)}")


@app.post("/rating")
def predict_rating(comment_data: Dict[str, str]):
    try:
        comment = comment_data.get("comment", "")

        translated_comment = translate_text(comment)

        preprocessed_comment = preprocess_text(translated_comment)

        predicted_rating = pipeline_svc.predict([preprocessed_comment])[0]

        return {"predicted_rating": str(predicted_rating)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/register")
def add_user(user: dict):
    if check_existing_user(user["email"], user["username"]):
        raise HTTPException(
            status_code=400, detail="Email or username already exists")

    hashed_password = pwd_context.hash(user["password"])
    user["password"] = hashed_password

    new_collection = db2["User"]
    try:
        result = new_collection.insert_one(user)
        user_id = str(result.inserted_id)
        user_name = user.get('username', '')
        return {"user_name": user_name, "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
def login(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    collection = db2["User"]
    user_data = collection.find_one({"username": user_name})

    if user_data and pwd_context.verify(password, user_data["password"]):
        user_id = str(user_data['_id'])
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_jwt_token({"sub": user_id}, expires_delta)
        return {
            "message": "Giriş başarıyla gerçekleşti",
            "user_name": user_name,
            "user_id": user_id,
            "access_token": jwt_token,
            "token_type": "bearer"
        }

    raise HTTPException(
        status_code=401,
        detail="Geçersiz kullanıcı adı veya şifre",
        headers={"WWW-Authenticate": "Bearer"},
    )


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


@app.get("/comments")
def get_comments():
    try:
        collection = db4["Comment"]
        comments = list(collection.find({}, {"_id": 0}))
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/comments")
def add_comment(comment_data: dict):
    try:
        comment = comment_data.get("comment", "")
        place_name = comment_data.get("place_name", "")
        username = comment_data.get("username", "")

        predicted_rating_response = predict_rating({"comment": comment})
        predicted_rating = predicted_rating_response.get(
            "predicted_rating", None)

        new_collection = db4["Comment"]
        result = new_collection.insert_one({
            "place_name": place_name,
            "username": username,
            "comment": comment,
            "rating": predicted_rating,
            "timestamp": datetime.utcnow()
        })

        comment_id = str(result.inserted_id)
        print(f"Yorum Başarıyla Kaydedildi: {comment}")

        y_true = list(db4["Comment"].find({}, {"_id": 0, "rating": 1}))
        y_pred = [predict_rating({"comment": c["comment"]})["predicted_rating"] for c in db4["Comment"].find(
            {}, {"_id": 0, "comment": 1})]

        y_true = [int(item["rating"])
                  for item in y_true if item["rating"] != "Değerlendirme Yok"]
        y_pred = [int(item) for item in y_pred if item != "Değerlendirme Yok"]
        if y_true and y_pred:
            accuracy = accuracy_score(y_true, y_pred)
            print(f"Model Doğruluğu: {accuracy * 100:.2f}%")

        return {"comment_id": comment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cafe")
def discover_cafe():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=coffee&type=cafe&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")

    if response.ok:
        data = response.json()
        new_collection = db1["Cafe"]
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/restaurant")
def discover_restaurant():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=konya&type=restaurant&location=37.8746429%2C32.4931554&radius=15000&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")
    print(response)
    if response.ok:
        data = response.json()
        new_collection = db1["Restaurant"]
        x = new_collection.insert_one({"data": data})
    return data


@app.get("/library")
def discover_library():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kütüphane&type=library&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE")
    if response.ok:
        data = response.json()
        new_collection = db1["Library"]
        x = new_collection.insert_one({"data": data})
    return data


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
    try:
        new_user = {
            "email": user_info.get("email", ""),
            "message": user_info.get("text", "")
        }

        send_email(new_user["email"], "Yeni Mesaj", new_user["message"])

        new_collection = db3["Mails"]
        result = new_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        user_email = new_user.get("email", "")
        return {"user_email": user_email, "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
