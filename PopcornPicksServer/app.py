from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy, session
from flask.templating import render_template
from sqlalchemy import ForeignKey, create_engine, select
from dataclasses import dataclass
from flask_migrate import Migrate
from flask_cors import CORS
import datetime
from sqlalchemy.sql.expression import func
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.debug = True
CORS(app)

# Adds config for using a MySQL DB
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('LOCALHOST_API')

# Creating an instance of SQLAlchemy
db = SQLAlchemy(app)

# Initializes flask-migrate
migrate = Migrate(app,db)

# Models
@dataclass
class Users(db.Model):
    user_id = db.Column(db.String(45), primary_key=True, unique=True, autoincrement=False)
    firsttimesetup = db.Column(db.Boolean, unique=False, default=False)
    
@dataclass
class User_Info(db.Model):
    user_id = db.Column(db.String(45), ForeignKey(Users.user_id), primary_key=True, nullable=False)
    genre = db.Column(db.String(20), primary_key=True)
    
@dataclass
class User_Reviews(db.Model):
    user_id = db.Column(db.String(45), ForeignKey(Users.user_id), primary_key=True, nullable=False)
    movie_id = db.Column(db.Integer, primary_key=True)
    movie_rating = db.Column(db.Integer)
    movie_review = db.Column(db.String(10000))

@dataclass
class User_Watch_History(db.Model):
    user_id = db.Column(db.String(45), ForeignKey(Users.user_id), primary_key=True, nullable=False)
    movie_id = db.Column(db.Integer, primary_key=True)
    watch_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    favorite = db.Column(db.Boolean)

# Adds user based on the logged in user_id to  database. 
# If a user already exists in the database, then
# a message is given that the user_id already exists.
@app.route('/add-user', methods=['POST'])
def add_user():
    print("Add User DB being accessed.")
    data = request.data
    userId = data.decode("utf-8")
    print("UserID is: " + userId)

    with app.app_context():
        q = db.session.query(Users).filter(
        Users.user_id==userId
        )

# If userId doesn't exist, then a response is given indicating that userId is missing.
        if not userId: 
            return jsonify({"error": "User ID is required"}), 400

# If userId exists in the database, then a response is given indicating so.
# Otherwise, add a new user to the database.
        if(db.session.query(q.exists()).scalar()):
            return jsonify({"note": "User ID already exists"}), 200
        else:
            new_user = Users(user_id=userId)
            db.session.add(new_user)
            db.session.commit()
    
            print("Insert has been committed for UserID: " + userId)
    
            return jsonify({"status": "success", "userId": userId}), 200

# Retrieves user information from the Users table in the database, and gives a response
# with that information.      
@app.route('/get-user', methods=['POST'])
def get_user():
    print("Get User DB being accessed.")
    data = request.get_data()
    user_id = data.decode("utf-8")
    
    with app.app_context():
        q = db.session.query(Users).filter(
        Users.user_id==user_id
        )
        
# If user_id exists in the User table, then that data is retrieved and sent as a response.
        if(db.session.query(q.exists()).scalar()):
            print("Getting User Now!!!")
            y = db.session.get(Users, (user_id)).firsttimesetup
            return jsonify({"user_id": user_id, "firsttimesetup": y}), 200
# Otherwise, a specific response is sent that indicates that the user doesn't exist.       
        else:
            return jsonify({"user_id": "NULL", "firsttimesetup": -1}), 200

#Updates the data in the Users table of the database (specifically, the firsttimesetup value).
@app.route('/set-user', methods=['POST'])
def set_user():
    print("Set User DB being accessed.")
    data = request.get_json()
    print(data)
    user_id = data.get('user_id')
    firsttimesetup = data.get('firsttimesetup')
    print("GOT DATA")
    
    with app.app_context():
        db.session.query(Users).filter(
        Users.user_id==user_id,
        ).update({'firsttimesetup': firsttimesetup})
        db.session.commit()

    
    return jsonify({"status": "success", "firsttimesetup": firsttimesetup}), 200

# Adds rating for movie based on user_id and movie_id to Popcornpicks database. 
# If a rating already exists, then
# the rating gets updated.
@app.route('/add-rating', methods=['POST'])
def add_rating():
    print("Add Rating DB being accessed.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    user_rating = data.get('movie_rating')
    
    
    with app.app_context():
        q = db.session.query(User_Reviews).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            )


        if(db.session.query(q.exists()).scalar()):
            db.session.query(User_Reviews).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            ).update({'movie_rating': user_rating})
            db.session.commit()
        else:
            new_entry = User_Reviews(user_id=user_id, movie_id = movie_id, movie_rating=user_rating)
            db.session.add(new_entry)
            db.session.commit()
    
    return jsonify({"status": "success", "movie_rating": user_rating}), 200

# Gets rating based on user_id and movie_id in User_Reviews table.
@app.route('/get-rating', methods=['POST'])
def get_rating():
    print("Get Rating DB being accessed.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    
    with app.app_context():
        q = db.session.query(User_Reviews.movie_rating).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            )
        if(db.session.query(q.exists()).scalar()):
            q = db.session.get(User_Reviews, (user_id, movie_id)).movie_rating
            return jsonify({"user_id": user_id, "movie_id": movie_id, "movie_rating": q}), 200
        else:
            return jsonify({"user_id": user_id, "movie_id": movie_id, "movie_rating": 0}), 200
            

# Adds Review based on user_id and movie_id to the User_Reviews table of the db. 
# If a review already exists, then the review gets updated.
@app.route('/add-review', methods=['POST'])
def add_review():
    print("Add Rating DB being accessed.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    user_review = data.get('movie_review')
    
    with app.app_context():
        q = db.session.query(User_Reviews).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            )

# If the user exists, then update the row of the User_Reviews table with the new review.
# Else, add a new row to the User_Reviews table and add the review to that row.
        if(db.session.query(q.exists()).scalar()):
            db.session.query(User_Reviews).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            ).update({'movie_review': user_review})
            db.session.commit()
        else:
            new_entry = User_Reviews(user_id=user_id, movie_id = movie_id, movie_review=user_review)
            db.session.add(new_entry)
            db.session.commit()
    
    return jsonify({"status": "success", "movie_review": user_review}), 200

# Gets review based on user_id and movie_id in User_Reviews table of the database.
@app.route('/get-review', methods=['POST'])
def get_review():
    print("Get Review DB being accessed.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    
    with app.app_context():
        q = db.session.query(User_Reviews.movie_review).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            )
        if(db.session.query(q.exists()).scalar()):
            q = db.session.get(User_Reviews, (user_id, movie_id)).movie_review
            return jsonify({"user_id": user_id, "movie_id": movie_id, "movie_review": q}), 200
        else:
            return jsonify({"user_id": user_id, "movie_id": movie_id, "movie_review": ""}), 200
        
# This function is depreciated and is no longer in use.          
# def add_genres():
#     print("Add Genre DB being accessed.")
#     data = request.get_json()
#     user_id = data.get('user_id')
#     gen_array = data.get('userGenres')
    
#     with app.app_context():
#         db.session.query(User_Info).filter(User_Info.user_id == user_id).delete()
#         db.session.commit()
        
#         for gen in gen_array:
#             print("User_id is: " + user_id + "\n")
#             print("Genre is: " + gen + "\n")
#             new_entry = User_Info(user_id=user_id, genre=gen)
#             db.session.add(new_entry)
#             db.session.commit()
    
#     return jsonify({"status": "success", "genres": gen_array}), 200

# # This function is depreciated and no longer in use.
# @app.route('/get-genres', methods=['POST'])
# def get_genres():
#     genIdArray = ["28","35","10749","27","878","12","16","80","99","18","10751","14","36","10402","9648","10770","53","10752","37"]
#     print("Get Genres DB being accessed.")
#     user_id = request.get_data()
#     gen_array = []
    
#     print(user_id)
#     with app.app_context():
#         for x in genIdArray:
#             print("X is: " + x)
#             q = db.session.query(User_Info).filter(
#             User_Info.user_id==user_id,
#             User_Info.genre==x
#             )
            
#             print(q)
#             if(db.session.query(q.exists()).scalar()):
#                 print("FOUND GENRE!\n")
#                 gen_array.append(x)
    
#     return jsonify({"userGenres": gen_array}), 200

# Adds movie to User_Watch_History table in db based on user_id and movie_id
@app.route('/add-watch-history', methods=['POST'])
def add_watch_history():
    print("Add Watch History DB being accessed.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    watch_date = data.get('watch_date') or datetime.datetime.now(datetime.timezone.utc)
    favorite = bool(data.get('favorite', False))

    with app.app_context():
        q = db.session.query(User_Watch_History).filter(
            User_Watch_History.user_id==user_id,
            User_Watch_History.movie_id==movie_id
            )
# If user_id and movie_id already exists on table, then updated the watch date.
# Else, add a new row to the User_Watch_History table.
        if(db.session.query(q.exists()).scalar()):
            db.session.query(User_Watch_History).filter(
            User_Watch_History.user_id==user_id,
            User_Watch_History.movie_id==movie_id
            ).update({'watch_date': watch_date})
            db.session.commit()
        else:
            new_entry = User_Watch_History(user_id=user_id, movie_id=movie_id, watch_date=watch_date, favorite=False)
            db.session.add(new_entry)
            db.session.commit()

        return jsonify({"status": "success", "watch_date": watch_date}), 200

# Requests watch history from a specific user_id from the User_Watch_History table.
# That data is sent as a response.
@app.route('/get-watch-history', methods=['POST'])
def get_watch_history():
    print("Fetching watch history from the database.")
    data = request.get_json()
    user_id = data.get('user_id')

    with app.app_context():
        watch_history = db.session.query(User_Watch_History).filter_by(user_id=user_id).all()

        history = [
            {
                "movie_id": record.movie_id,
                "watch_date": record.watch_date,
                "favorite": record.favorite
            }
            for record in watch_history
        ]
        return jsonify({"user_id": user_id, "watch_history": history}), 200
    
# Checks if a Watch History entry exists based on a specific user and movie. If it does,
# return a 1 (True) or 0 (False). This will be used to change the icon on 
# the Movie Info page depending if the user has seen the movie or not.
@app.route('/watchHistoryExists', methods=['POST'])
def watchHistoryExists():
    print("Watch History DB being accessed to see if History.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    
    print("user_id: " + user_id)
    print("Movie_ID: " + str(movie_id))
    
    with app.app_context():
        q = db.session.query(User_Watch_History).filter(
            User_Watch_History.user_id==user_id,
            User_Watch_History.movie_id==movie_id
            )


        if(db.session.query(q.exists()).scalar()):
            return "1"
        else:
            return "0"

# Remove a specific entry in the User_Watch_History table based on user_id and movie_id.
@app.route('/remove_Watch_History', methods=['POST'])
def remove_Watch_History():
    print("Attempting to remove from Watch History.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    
    print("user_id: " + user_id)
    print("Movie_ID: " + str(movie_id))
    
    with app.app_context():
        q = db.session.query(User_Watch_History).filter(
            User_Watch_History.user_id==user_id,
            User_Watch_History.movie_id==movie_id
            )

# If the entry exists, delete the entry and return a 0 (indicating that entry is erased).
# Otherwise, return a 1.
        if(db.session.query(q.exists()).scalar()):
            q.delete()
            db.session.commit()
            return "0"
        else:
            return "1"

# Removes a row from the User_Reviews table that contains a specific user_id and movie_id.       
@app.route('/remove_Review_Rating', methods=['POST'])
def remove_Review_Rating():
    print("Attempting to remove Rating and Review from User Reivews.")
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    
    print("user_id: " + user_id)
    print("Movie_ID: " + str(movie_id))
    
    with app.app_context():
        q = db.session.query(User_Reviews).filter(
            User_Reviews.user_id==user_id,
            User_Reviews.movie_id==movie_id
            )

# If the a row exists that contains the requested user_id and movie_id, then delete the row
# and return 0 (indicating that row was deleted). Otherwise, return a 1.
        if(db.session.query(q.exists()).scalar()):
            q.delete()
            db.session.commit()
            return "0"
        else:
            return "1"

# Updates the favorite value of a given row (depending on the user_id and movie_id)
# In the User_Watch_History table.
@app.route('/updateFavorite', methods=['POST'])
def update_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    favorite = data.get('favorite')

    with app.app_context():
        record = db.session.query(User_Watch_History).filter_by(user_id=user_id, movie_id=movie_id).first()
        if record:
            record.favorite = favorite
            db.session.commit()
            return jsonify({"message": "Favorite status updated"}), 200
        else:
            return jsonify({"message": "Record not found"}), 404

# Requests the value of the favorite property of a row given a specific user_id and movie_id.
# Sends a response with that information or an indication that the record wasn't found.
@app.route('/checkFavorite', methods=['POST'])
def check_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')

    with app.app_context():
        record = db.session.query(User_Watch_History).filter_by(user_id=user_id, movie_id=movie_id).first()
        if record:
            return jsonify({"favorite": record.favorite}), 200
        else:
            return jsonify({"message": "Record not found"}), 404

# Retrieves a list of movie_ids that have the favorite value of 1 in the User_Watch_History
# table. The function is used in findRecMovie function in search.py.
def getFavMovId():
    data = request.get_data()
    user_id = data.decode("utf-8")
    fav_movie_ids = []

    with app.app_context():
        favMovies = db.session.query(User_Watch_History).filter_by(user_id = user_id, favorite = 1).all()
        for i in favMovies:
            fav_movie_ids.append(i.movie_id)

        print(fav_movie_ids)
        return fav_movie_ids

if __name__ == '__main__':
    app.run(debug=False)