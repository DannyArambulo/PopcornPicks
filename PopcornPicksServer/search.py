from flask import Flask, request, jsonify, render_template, request
from flask_cors import CORS, cross_origin
import os
import requests
import sys
import sqlalchemy
from dotenv import load_dotenv
from flask_mysqldb import MySQL
from app import add_user, add_rating, add_review, get_rating, get_review, add_watch_history

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

@search.route('/addWatchHistory', methods=['POST'])
def addWatchHistory():
    print("Add Watch History being accessed\n")
    response = add_watch_history()
    print(response)
    return response

if __name__ == '__main__':
    search.run(debug=False)