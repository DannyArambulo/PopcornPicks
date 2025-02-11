from flask import Flask, request, jsonify, render_template, request
from flask_cors import CORS, cross_origin
import os
import requests
import sys
import sqlalchemy
from dotenv import load_dotenv
from flask_mysqldb import MySQL
from app import add_user, add_rating, add_review, get_rating, get_review, add_watch_history, get_watch_history, update_favorite, get_genres, add_genres, get_user, set_user, getFavMovId, watchHistoryExists

import pandas as pd
import pickle
import random

load_dotenv()
TMDB_API_KEY = os.getenv('TMDB_API_KEY')

search = Flask(__name__)
CORS(search)
""" CORS(search, resources={r"/search/*": {"origins": "http://localhost:4200"}}) 
CORS(search, resources={r"/movie/*": {"origins": "http://localhost:4200"}})
CORS(search, resources={r"/addUser": {"origins": "http://localhost:4200"}}) 
CORS(search, resources={r"/addRating": {"origins": "http://localhost:4200"}})
CORS(search, resources={r"/addReview": {"origins": "http://localhost:4200"}})  """


search.app_context()
@search.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    response = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}')
    return jsonify(response.json())

@search.route('/movie', methods=['GET'])
def getMovie():
    movie_id = request.args.get('id')
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}')
    # print(response.text)
    return jsonify(response.json())

@search.route('/addUser', methods=['POST', 'OPTIONS'])
def addUser():
    print("Add user being accessed\n")
    response = add_user()
    print(response)
    return response

@search.route('/getUser', methods=['POST', 'OPTIONS'])
def getUser():
    print("Add user being accessed\n")
    response = get_user()
    print(response)
    return response

@search.route('/setUser', methods=['POST'])
def setUser():
    print("Set user being accessed\n")
    response = set_user()
    print(response)
    return response

@search.route('/addRating', methods=['POST'])
def addRating():
    print("Add Rating being accessed\n")
    response = add_rating()
    print(response)
    return response

@search.route('/addReview', methods=['POST'])
def addReview():
    print("Add Review being accessed\n")
    response = add_review()
    print(response)
    return response

@search.route('/getRating', methods=['POST'])
def getRating():
    print("Get Rating being accessed\n")
    response = get_rating()
    print(response)
    return response

@search.route('/getReview', methods=['POST'])
def getReview():
    print("Get Review being accessed\n")
    response = get_review()
    print(response)
    return response

@search.route('/getGenre', methods=['POST'])
def getGenre():
    print("Get Genre being accessed\n")
    response = get_genres()
    print(response)
    return response

@search.route('/setGenre', methods=['POST'])
def setGenre():
    print("Set Genre being accessed\n")
    response = add_genres()
    print(response)
    return response

@search.route('/addWatchHistory', methods=['POST'])
def addWatchHistory():
    print("Add Watch History being accessed\n")
    response = add_watch_history()
    print(response)
    return response

@search.route('/getWatchHistory', methods=['POST'])
def getWatchHistory():
    print("Get Watch History being accessed\n")
    response = get_watch_history()
    print(response)
    return response

@search.route('/updateFavorite', methods=['POST'])
def updateFavorite():
    print("Updating favorite status\n")
    response = update_favorite()
    print(response)
    return response

@search.route('/hasWatchHistory', methods=['POST'])
def hasWatchHistory():
    print("Entering Watch History Exists function")
    response = watchHistoryExists()
    print(response)
    return response

def get_recommendations(imdb_id, count=5):
    MovieReviewDatasetTMDB = pd.read_csv("../PopcornPicks Movie Recommender/tmdb_movies_data.csv")

    with open('../PopcornPicks Movie Recommender/SimilarityTMDB.pickle', 'rb') as handle:
        SimilarityTMDB = pickle.load(handle)

    index = MovieReviewDatasetTMDB.index[MovieReviewDatasetTMDB['imdb_id'].str.lower() == imdb_id]
    
    if (len(index) == 0):
        print("\n\nNothing Found\n\n")
        return []

    similarities = list(enumerate(SimilarityTMDB[index[0]]))
    
    recommendations = sorted(similarities, key=lambda x: x[1], reverse=True)
    
    top_recs = recommendations[1:count + 1]

    imdb_ids = []

    for i in range(len(top_recs)):
        imdb_id = MovieReviewDatasetTMDB.iloc[top_recs[i][0]]['imdb_id']
        imdb_ids.append(imdb_id)

    return imdb_ids[random.randint(0,count-1)]

@search.route('/recMovie', methods=['POST'])
def findRecMovie():
    print("Finding Recommended Movie\n\n")
    
    tmdb_id = getFavMovId() #Get a favorite movie from sql database

    response = requests.get(f'https://api.themoviedb.org/3/movie/{tmdb_id}/external_ids?api_key={TMDB_API_KEY}')
    print("Chosen Source Movie: \n")
    print(response.text)
    print("\n\n")
    r = response.json()
    user_imdb_id = r["imdb_id"]

    reccomend = get_recommendations(user_imdb_id)
    
    response = requests.get(f'https://api.themoviedb.org/3/find/{reccomend}?api_key={TMDB_API_KEY}&external_source=imdb_id')
    print("Recommended Movie: \n")
    print(response.text)
    print("\n\n")
    
    print(response.json())
    print("\n\n")
    return jsonify(response.json())

if __name__ == '__main__':
    search.run(debug=False)