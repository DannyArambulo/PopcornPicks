import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)
tmdb_data = pd.read_csv('../PopcornPicks Movie Recommender/tmdb_movies_data.csv')

@app.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query','').lower()
    results = tmdb_data[tmdb_data['title'].str.contains(query, case=False)]
    return jsonify(results.to_dict(orient='records'))