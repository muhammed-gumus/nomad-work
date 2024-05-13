from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from googletrans import Translator
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pandas as pd
from pydantic import BaseModel  # BaseModel import edildi.
from fastapi import Depends


# MongoDB bağlantısı
myclient = MongoClient("mongodb+srv://muhammed-gumus:Mami040953@muhammedgumus.80fpuqf.mongodb.net/?retryWrites=true&w=majority")
db4 = myclient["Comments"]

# FastAPI uygulaması
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


@app.post("/comments")
def add_comment(comment_data: dict):
    comment = comment_data.get("comment", "")
    username = comment_data.get("username", "")
    place_name = comment_data.get("place_name", "")

    # MongoDB'ye yorumu ekleyin
    new_collection = db4["Comment"]
    try:
        result = new_collection.insert_one({
            "place_name": place_name,
            "username": username,
            "comment": comment,
            "timestamp": datetime.utcnow()
        })

        comment_id = str(result.inserted_id)
        print(f"Yorum Başarıyla Kaydedildi: {comment}")
        return {"comment_id": comment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/users", response_model=dict)
def get_users(current_user: str = Depends(get_current_user)):
    return {"user_id": current_user}





# # Veri setini yükleme ve modeli eğitme
# data = pd.read_csv('yorumlar.csv')
# vectorizer = TfidfVectorizer()
# X = vectorizer.fit_transform(data['Review Text'])
# classifier = MultinomialNB()
# classifier.fit(X, data['Rating'])

# class CommentIn(BaseModel):
#     comment: str
#     username: str
#     place_name: str

# @app.get("/comments")
# def get_comments():
#     try:
#         # Tüm yorumları MongoDB'den al
#         comments_collection = db4["Comment"]
#         comments = comments_collection.find({}, {"_id": 0})

#         # Yorumları liste halinde döndür
#         return list(comments)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/comments")
# def add_comment(comment_data: CommentIn):
#     try:
#         # Yorumu İngilizce'ye çevirme
#         translated_comment = Translator().translate(comment_data.comment, dest='en').text
        
#         # Tahmin etme
#         X_test = vectorizer.transform([translated_comment])
#         predicted_rating = classifier.predict(X_test)[0]

#         # MongoDB'ye yorumu kaydetme
#         new_collection = db4["Comment"]
#         result = new_collection.insert_one({
#             "place_name": comment_data.place_name,
#             "username": comment_data.username,
#             "comment": comment_data.comment,
#             "predicted_rating": predicted_rating,
#             "timestamp": datetime.utcnow()
#         })

#         comment_id = str(result.inserted_id)
#         print(f"Yorum Başarıyla Kaydedildi: {comment_data.comment}")
#         return {"comment_id": comment_id}
#     except Exception as e:
#         print(f"Yorum ekleme hatası: {e}")
#         raise HTTPException(
#             status_code=500, detail="Yorum ekleme işlemi sırasında bir hata oluştu")
