from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import requests
import sys
from dotenv import load_dotenv
from flaskext.mysql import MySQL

load_dotenv()
TMDB_API_KEY = os.getenv('TMDB_API_KEY')

search = Flask(__name__)
CORS(search, resources={r"/search/*": {"origins": "http://localhost:4200"}}) 
CORS(search, resources={r"/movie/*": {"origins": "http://localhost:4200"}})

search.config['MYSQL_HOST'] = 'localhost'
search.config['MYSQL_USER'] = 'root'
search.config['MYSQL_PASSWORD'] = '1234'
search.config['MYSQL_DB'] = 'popcornpicks'   

@search.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    response = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}')
    return jsonify(response.json())

@search.route('/movie', methods=['GET'])
def getMovie():
    movie_id = request.args.get('id')
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}')
    print(response.text)
    return jsonify(response.json())

def test_sql():
    msg = ""
    cursor = MySQL.con

if __name__ == '__main__':
    search.run(debug=True)