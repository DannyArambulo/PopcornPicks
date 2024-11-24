from flask import Flask, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask.templating import render_template
from sqlalchemy import ForeignKey, create_engine
from dataclasses import dataclass
from flask_migrate import Migrate


app = Flask(__name__)
app.debug = True

#adds config for using a MySQL DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost:3306/popcornpicksdb'

#Creating an instance of SQLAlchemy
db = SQLAlchemy(app)

#Initializes flask-migrate
migrate = Migrate(app,db)

#Models
@dataclass
class Users(db.Model):
    user_id = db.Column(db.String(45), primary_key=True, unique=True, autoincrement=False)
    
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
    watch_date = db.Column(db.Date)
    favorite = db.Column(db.Boolean)
    
if __name__ == '__main__':
    app.run()