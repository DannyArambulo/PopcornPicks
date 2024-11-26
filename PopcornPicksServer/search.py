from flask import Flask, request, jsonify, render_template, request
from flask_cors import CORS, cross_origin
import os
import requests
import sys
import sqlalchemy
from dotenv import load_dotenv
from flask_mysqldb import MySQL



load_dotenv()
TMDB_API_KEY = os.getenv('TMDB_API_KEY')

search = Flask(__name__)
CORS(search, resources={r"/search/*": {"origins": "http://localhost:4200"}}) 
CORS(search, resources={r"/movie/*": {"origins": "http://localhost:4200"}})

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
    print(response.text)
    return jsonify(response.json())


# running model
import pandas as pd
import pickle
#count is the number of recommendations
#returns a list of imdb recommendations
def get_recommendations(imdb_id, count=5):
    MovieReviewDatasetTMDB = pd.read_csv("PopcornPicks Movie Recommender/tmdb_movies_data.csv")

    with open('PopcornPicks Movie Recommender/SimilarityTMDB.pickle', 'rb') as handle:
        SimilarityTMDB = pickle.load(handle)

    index = MovieReviewDatasetTMDB.index[MovieReviewDatasetTMDB['imdb_id'].str.lower() == imdb_id]
    
    if (len(index) == 0):
        return []

    similarities = list(enumerate(SimilarityTMDB[index[0]]))
    
    recommendations = sorted(similarities, key=lambda x: x[1], reverse=True)
    
    top_recs = recommendations[1:count + 1]

    imdb_ids = []

    for i in range(len(top_recs)):
        imdb_id = MovieReviewDatasetTMDB.iloc[top_recs[i][0]]['imdb_id']
        imdb_ids.append(imdb_id)

    return imdb_ids

print(get_recommendations('tt0126029'))


if __name__ == '__main__':
    search.run(debug=True)