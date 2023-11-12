from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Response, status
import json
import requests


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/cafe")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=cafe&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        print(data)
    return data

@app.get("/restaurant")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        print(data)
    return data

@app.get("/library")
def discover():
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=library&location=37.8746429%2C32.4931554&radius=1500&key=AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM")
    print(response)
    if response.ok:
        data = response.json()
        print(data)
    return data