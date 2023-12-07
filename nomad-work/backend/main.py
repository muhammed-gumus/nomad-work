from typing import Dict
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from pymongo import MongoClient

myclient = MongoClient(
    "mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")
db = myclient["Discover"]

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
users_db: Dict[str, dict] = {}


@app.get("/cafe")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=coffee&type=cafe&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")

    if response.ok:
        data = response.json()
        new_collection = db["Cafe"]

        if "results" in data:
            for result in data["results"]:
                # MongoDB'de aynı veri var mı kontrol et
                existing_data = new_collection.find_one({"data": result})

                if not existing_data:
                    # MongoDB'de bulunmayan veriyi ekleyin
                    x = new_collection.insert_one({"data": result})
                else:
                    print("aynı veri var kanki")

    return data


@app.get("/restaurant")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=konya&type=restaurant&location=37.8746429%2C32.4931554&radius=15000&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        new_collection = db["Restaurant"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
        print(data)
    return data


@app.get("/library")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=kütüphane&type=library&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        new_collection = db["Library"]
        # "data" adlı bir anahtarla veriyi ekledik
        x = new_collection.insert_one({"data": data})
        print(data)
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


# Kullanıcı bilgilerini depolamak için bir veri yapısı
users_db: Dict[str, dict] = {}


@app.post("/user")
def add_user(user: dict):
    # user_id'yi otomatik olarak atayın
    user_id = str(len(users_db) + 1)
    user['user_id'] = user_id

    # Kullanıcı bilgilerini depolayın
    users_db[user_id] = user

    user_name = user.get('username', '')
    print(f"User Information Received: {user}")
    print(f"Username: {user_name}")
    return {"user_name": user_name, "user_id": user_id}


@app.post("/login")
def login(user_info: dict):
    user_name = user_info.get('username', '')
    password = user_info.get('password', '')

    # Kullanıcı adı ve şifreyi kontrol et
    for user_id, user_data in users_db.items():
        if user_data.get('username') == user_name and user_data.get('password') == password:
            return {"message": "Giriş başarıyla gerçekleşti", "user_name": user_name, "user_id": user_id}

    return {"message": "Kullanıcı adı veya şifre hatalı"}


@app.get("/users")
def get_users():
    return users_db
