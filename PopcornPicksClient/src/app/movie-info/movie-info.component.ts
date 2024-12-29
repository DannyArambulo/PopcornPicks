import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';


interface Movie {
  title: string;
  overview: string;
  release_date: string;
  id: number;
  genres: Genre[];
}

interface TMDbResponse {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genres: Genre[];
}

interface Genre {
  id: number;
  name: string;
}

interface Review {
  user_id: string;
  movie_id: number;
  movie_review: string;
}

interface Rating {
  user_id: string;
  movie_id: number;
  movie_rating: number;
}

interface UserMovieStats {
  user_id: string;
  movie_id: number;
}

interface WatchHistory {
  user_id: string;
  movie_id: number;
  watch_date: string;
  favorite: boolean;
}

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatButtonModule, MatIconModule, CommonModule, MatInputModule, FormsModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css'
})
export class MovieInfoComponent implements OnInit{

  numStars: number[] = [1,2,3,4,5,6,7,8,9,10];
  rating: number = 0;
  movieId: number = 0;
  movieTitle: string = "";
  movieDate: string = "";
  movieOverview: string = "";
  posterPath: string = "";
  movieReview: string = "";
  movieReviewTemp: string = "";
  movieGenres: string[] = [];
  watchDate: string = "";
  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCancel: boolean = true;
  disableText: boolean = true;
  wasWatched: Number = 0;
  userId: string = "";
  JSONRating: any = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.movieId = params['id'];
      if (this.movieId) {
        this.getMovie();
      }
    });

    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        // console.log('User ID:', this.userId);
        this.getRating();
        console.log("Rating Finished");
        this.getReview();
        console.log("Review Finished");
        this.checkWatchHistory();
        console.log("Watch History checked");
      }
    });
  }

  getMovie() {
    this.http.get<TMDbResponse>(`http://127.0.0.1:5000/movie?id=${this.movieId}`)
    .subscribe(response => {
       /* console.log("Title is: " + response.title);
       console.log("Date is: " + response.release_date);
       console.log("Overview is: " + response.overview);
       console.log("Poster is: " + response.poster_path);
       console.log("Genres are: " + response.genres); */
       this.movieTitle = response.title;
       this.movieDate = response.release_date;
       this.movieOverview = response.overview;
       this.posterPath = response.poster_path;
       this.movieGenres = response.genres.map((genre: Genre) => genre.name);
      });
  }

  setRating(rating: Rating): void {
    const apiUrl = 'http://localhost:5000/addRating';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(rating) , {'headers': headers}).subscribe(
      response => {
        console.log('Rating successfully sent to backend:', response);
      },
      error => {
        console.error('Error sending Rating to backend:', error);
      }
    );
  }

  getRating(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = 'http://localhost:5000/getRating';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie) , {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Rating successfully sent to backend:', response);
        const RateResponse: Rating = <Rating><unknown>response;
        this.rating = RateResponse.movie_rating;
      },
      error => {
        console.error('Error sending Rating to backend:', error);
      }
    );
  }

  setReview(review: Review): void {
    const apiUrl = 'http://localhost:5000/addReview';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(review), {'headers': headers}).subscribe(
      response => {
        console.log('Review successfully sent to backend:', response);
      },
      error => {
        console.error('Error sending Review to backend:', error);
      }
    );
  }

  getReview(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = 'http://localhost:5000/getReview';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie) , {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Review successfully sent to backend:', response);
        const RateResponse: Review = <Review><unknown>response;
        this.movieReview = RateResponse.movie_review;
      },
      error => {
        console.error('Error sending Rating to backend:', error);
      }
    );
  }

  addToWatchHistory(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = 'http://localhost:5000/addWatchHistory';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Watch History successfully sent to backend:', response);
        const WatchHistoryResponse: WatchHistory = <WatchHistory><unknown>response;
        this.watchDate = WatchHistoryResponse.watch_date;
        this.checkWatchHistory();
      },
      error => {
        console.error('Error sending Watch History to backend:', error);
      }
    );
  }

  checkWatchHistory(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = 'http://localhost:5000/hasWatchHistory';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('Watch History status sent to backend:', response);
        this.wasWatched = <Number><unknown>response;
      },
      error => {
        console.error('Error sending Watch History to backend:', error);
      }
    );
  }


  starRating(score: number) {
    this.rating = score;
    console.log("Rating: ", this.rating);

    const MovieRating: Rating = {user_id: this.userId, movie_id: this.movieId, movie_rating: this.rating};

    console.log(MovieRating)

    this.setRating(MovieRating);
    
  }

  showStar(id:number){
    if (this.rating >= id + 1) {
      return 'star';
    }

    else {
      return 'star_border';
    }
  }

  activateRevEdit(){
    this.movieReviewTemp = this.movieReview;
    this.disableEdit = true;
    this.disableSave = false;
    this.disableCancel = false;
    this.disableText = false;
  }

  subReview(){
    this.movieReview = this.movieReview
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCancel = true;
    this.disableText = true;
    if(this.movieReview == "")
    {
      const movieReview: Review = {user_id: this.userId, movie_id: this.movieId, movie_review: ""};
      this.setReview(movieReview);
    }
    else
    {
      const movieReview: Review = {user_id: this.userId, movie_id: this.movieId, movie_review: this.movieReview};
      this.setReview(movieReview);
    }
    
  }

  revertReview(){
    this.movieReview = this.movieReviewTemp;
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCancel = true;
    this.disableText = true;
  }
}
