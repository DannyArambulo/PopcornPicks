from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import os
import requests
import sys
import sqlalchemy
from dotenv import load_dotenv
from flask_mysqldb import MySQL
from app import add_user, add_rating, add_review, get_rating, get_review, add_watch_history, get_watch_history, update_favorite, get_user, set_user, getFavMovId, watchHistoryExists, check_favorite, remove_Watch_History, remove_Review_Rating
import joblib

import pandas as pd
import pickle
import random

# Loads key to make requests from TMDB API.
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
# Loading joblib file at beginning of login.
SimilarityTMDB = joblib.load("../PopcornPicks Movie Recommender/SimilarityTMDB.joblib", mmap_mode='r')

# Note: All functions in this file except for get_recommendations, findRecMovie, and testServer are calling
# functions in the app.py file. See comments in that file for more details on how the functions work.

# Makes a request to the search function in the TMDB API in order to get search results.
@search.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    response = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}')
    return jsonify(response.json())

# Retrieves movie data from TMDB API by sending a request using the movie_id as input.
@search.route('/movie', methods=['GET'])
def getMovie():
    print("I am getting a movie!")
    movie_id = request.args.get('id')
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?append_to_response=videos&language=en-US&api_key={TMDB_API_KEY}')
    print(response.text)
    return response.json()

# Adds user id from Auth0 to the PopcornPicks Database.
@search.route('/addUser', methods=['POST', 'OPTIONS'])
def addUser():
    print("Add user being accessed\n")
    response = add_user()
    print(response)
    return response

# Gets the user data that is currently logged in from the PopcornPicks Database.
@search.route('/getUser', methods=['POST', 'OPTIONS'])
def getUser():
    print("Get User being accessed\n")
    response = get_user()
    print(response)
    return response

# Set a value to indicate that the user has logged in at least once.
@search.route('/setUser', methods=['POST'])
def setUser():
    print("Set user being accessed\n")
    response = set_user()
    print(response)
    return response

# Adds rating to a movie based on user id and movie id.
@search.route('/addRating', methods=['POST'])
def addRating():
    print("Add Rating being accessed\n")
    response = add_rating()
    print(response)
    return response

# Adds review to a movie based on user id and movie id
@search.route('/addReview', methods=['POST'])
def addReview():
    print("Add Review being accessed\n")
    response = add_review()
    print(response)
    return response

# Requests rating from PopcornPicks database based on user id and movie id.
@search.route('/getRating', methods=['POST'])
def getRating():
    print("Get Rating being accessed\n")
    response = get_rating()
    print(response)
    return response

# Requests rating from PopcornPicks database based on user id and movie id.
@search.route('/getReview', methods=['POST'])
def getReview():
    print("Get Review being accessed\n")
    response = get_review()
    print(response)
    return response

# # This function was to get favorite genres based on the user. 
# # This function is depreciated and no longer used.
# @search.route('/getGenre', methods=['POST'])
# def getGenre():
#     print("Get Genre being accessed\n")
#     response = get_genres()
#     print(response)
#     return response

# # This function was to set favorite genres based on the user. 
# # This function is depreciated and no longer used.
# @search.route('/setGenre', methods=['POST'])
# def setGenre():
#     print("Set Genre being accessed\n")
#     response = add_genres()
#     print(response)
#     return response

# Adds movie id to user id's Watch History in the PopcornPicks database.
@search.route('/addWatchHistory', methods=['POST'])
def addWatchHistory():
    print("Add Watch History being accessed\n")
    response = add_watch_history()
    print(response)
    return response

# Removes movie id from user id's Watch History in the PopcorPicks database.
@search.route('/removeWatchHistory', methods=['POST'])
def removeWatchHistory():
    print("Remove Watch History being accessed\n")
    response = remove_Watch_History()
    print(response)
    return response

# Removes the review and rating for a movie in the PopcornPicks database
# based on the user id and movie id.
@search.route('/removeReviewRating', methods=['POST'])
def removeReviewRating():
    print("Remove Review and Rating being accessed\n")
    response = remove_Review_Rating()
    print(response)
    return response

# Requests all the movie ids for a user id.
@search.route('/getWatchHistory', methods=['POST'])
def getWatchHistory():
    print("Get Watch History being accessed\n")
    response = get_watch_history()
    print(response)
    return response

# Updates the favorite status of a particular movie in the PopcornPicks database
# based on movie id and user id.
@search.route('/updateFavorite', methods=['POST'])
def updateFavorite():
    print("Updating favorite status\n")
    response = update_favorite()
    print(response)
    return response

# Requests the favorite status for a movie in the PopcornPicks database 
# based on the user id and movie id.
@search.route('/checkFavorite', methods=['POST'])
def checkFavorite():
    print("Checking favorite status\n")
    response = check_favorite()
    print(response)
    return response

# Checks to see if a movie exists in a user id's Watch History on the PopcornPicks database.
@search.route('/hasWatchHistory', methods=['POST'])
def hasWatchHistory():
    print("Entering Watch History Exists function")
    response = watchHistoryExists()
    print(response)
    return response


def get_recommendations(fav_imdb_ids):
    count=len(fav_imdb_ids)+30

    MovieReviewDatasetTMDB = pd.read_csv("../PopcornPicks Movie Recommender/tmdb_movies_data.csv")

    # with open('../PopcornPicks Movie Recommender/SimilarityTMDB.pickle', 'rb') as handle:
    imdb_id = random.choice(fav_imdb_ids)

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
        if  imdb_id not in fav_imdb_ids:
            imdb_ids.append(imdb_id)

    return random.choice(imdb_ids)

@search.route('/recMovie', methods=['POST'])
def findRecMovie():
    print("Finding Recommended Movie\n\n")

    ##Needs a list of favorite movies## 
    tmdb_id = getFavMovId() #Get a favorite movie from sql database
    print("favorite movies: ")
    print(tmdb_id)
    user_imdb_id_list = []
    for i in tmdb_id:
        response = requests.get(f'https://api.themoviedb.org/3/movie/{i}/external_ids?api_key={TMDB_API_KEY}')
        print("Chosen Source Movie: \n")
        print(response.text)
        print("\n\n")
        r = response.json()
        user_imdb_id_list.append(r["imdb_id"])
        #user_imdb_id = r["imdb_id"]

    recommend = get_recommendations(user_imdb_id_list)
    
    response = requests.get(f'https://api.themoviedb.org/3/find/{recommend}?api_key={TMDB_API_KEY}&external_source=imdb_id')
    print("Recommended Movie: \n")
    print(response.text)
    print("\n\n")
    
    print(response.json())
    print("\n\n")
    return jsonify(response.json())

# Test function to see if Flask app is running.
@search.route('/')
def testServer():
    return "Hello World!"

if __name__ == '__main__':
    search.run()
