from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import requests
from dotenv import load_dotenv

load_dotenv()
TMDB_API_KEY = os.getenv('TMDB_API_KEY')

search = Flask(__name__)
CORS(search, resources={r"/search/*": {"origins": "http://localhost:4200"}}) 
CORS(search, resources={r"/movie/*": {"origins": "http://localhost:4200"}}) 

@search.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    response = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}')
    return jsonify(response.json())

@search.route('/movie', methods=['GET'])
def getMovie():
    movieId = request.args.get('id')
    response = requests.get(f'https://api.themoviedb.org/3/movie/?api_key={TMDB_API_KEY}&movie_id={movieId}')
    return jsonify(response.json())

if __name__ == '__main__':
    search.run(debug=True)