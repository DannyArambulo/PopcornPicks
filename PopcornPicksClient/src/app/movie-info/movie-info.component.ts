import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MovieDataService } from '../moviedata/movie-data.service';
import { Movie } from '../moviedata/movie';
import { environment } from '../../environments/environment';
import { Observable, timeout } from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog'


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
  watch_datetime: string;
  favorite: boolean;
}

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatButtonModule, MatIconModule, CommonModule, MatInputModule, FormsModule, MatTooltipModule],
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
  movieReview: string = "";
  movieReviewTemp: string = "";
  movieGenres: string[] = [];
  watchDate: string = "";
  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCancel: boolean = true;
  disableText: boolean = true;
  wasWatched: Number = 0;
  isFavorite: boolean = false;
  userId: string = "";
  JSONRating: any = [];
  currMovie$!: Observable<Movie>;
  movieLoc: string = window.location.href;

  readonly dialog = inject(MatDialog);

  constructor(private route: ActivatedRoute, private http: HttpClient, public auth: AuthService, public movieService: MovieDataService, public router: Router) {};

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.movieId = params['id'];
      if (this.movieId) {
        // console.log("Movie ID is: " + this.movieId)
        this.movieService.setMovieId(this.movieId);
        // console.log("Got MOVIE ID!")
      }
    });

    // console.log("Getting the movie!!!")
    this.currMovie$ = this.movieService.getMovie();

    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        // console.log('User ID:', this.userId);
        this.getRating();
        // console.log("Rating Finished");
        this.getReview();
        // console.log("Review Finished");
        this.checkWatchHistory();
        // console.log("Watch History checked");
      }
    });
  }

  /* getMovie() {
    this.movieTitle = this.movieService.getTitle();
    this.movieDate = this.movieService.getDate();
    this.movieGenres = this.movieService.getGenres();
    this.movieOverview = this.movieService.getOverview();
    this.posterPath = this.movieService.getPoster();
  } */

  // Sets rating on movie for a given User and sends updated rating to API.
  setRating(rating: Rating): void {
    const apiUrl = environment.baseUrl + 'addRating';
    const headers = { 'Content-Type': 'application/json'}; 

    /* console.log("Current rating:" + (this.rating));
    console.log("Current wasWatched:" + (this.wasWatched));

    console.log("First statement bool: " + (this.rating != 0));
    console.log("Second statement bool: " + (this.wasWatched == 0)); */
    
    // Checks if Movie was in a User's Watch History. If it wasn't, add it to 
    // the Watch History and update the rating. If not, just update the rating.
    if(this.rating != 0 && this.wasWatched == 0)
    {
      // console.log("Adding to Watch History")
      this.addToWatchHistory();
      this.http.post<JSON>(apiUrl, JSON.stringify(rating) , {'headers': headers}).subscribe(
        response => {
          //  console.log('Rating successfully sent to backend:', response);
        },
        error => {
          //  console.error('Error sending Rating to backend:', error);
        }
      );
    }

    else
    {
      this.http.post<JSON>(apiUrl, JSON.stringify(rating) , {'headers': headers}).subscribe(
        response => {
          //  console.log('Rating successfully sent to backend:', response);
        },
        error => {
          //  console.error('Error sending Rating to backend:', error);
        }
      );
    }
    
  }

// Retrieves rating for a movie depending on the User logged in from the API.
  getRating(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'getRating';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie) , {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Rating successfully sent to backend:', response); */
        const RateResponse: Rating = <Rating><unknown>response;
        this.rating = RateResponse.movie_rating;
      },
      error => {
        // console.error('Error sending Rating to backend:', error);
      }
    );
  }

// Saves review for a Movie based on the User and sends the information to the API.
  setReview(review: Review): void {
    const apiUrl = environment.baseUrl + 'addReview';
    const headers = { 'Content-Type': 'application/json'};
    
    /* console.log("Current movieReview:" + (this.movieReview));
    console.log("Current wasWatched:" + (this.wasWatched));

    console.log("First statement bool: " + (this.movieReview != ""));
    console.log("Second statement bool: " + (this.wasWatched == 0)); */

    // Checks if Movie was in a User's Watch History. If it wasn't, add it to 
    // the Watch History and update the review. If not, just update the review.
    if(this.movieReview != "" && this.wasWatched == 0)
    {
      // console.log("Will add to watch history");
      this.addToWatchHistory();

      this.http.post<JSON>(apiUrl, JSON.stringify(review), {'headers': headers}).subscribe(
        response => {
          //  console.log('Review successfully sent to backend:', response);
        },
        error => {
          // console.error('Error sending Review to backend:', error);
        }
      );
    }

    else
    {
      this.http.post<JSON>(apiUrl, JSON.stringify(review), {'headers': headers}).subscribe(
        response => {
          //  console.log('Review successfully sent to backend:', response);
        },
        error => {
          //  console.error('Error sending Review to backend:', error);
        }
      );
    }
  }

// Retrieves review for a movie based on the User.
  getReview(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'getReview';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie) , {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Review successfully sent to backend:', response); */
        const RateResponse: Review = <Review><unknown>response;
        this.movieReview = RateResponse.movie_review;
      },
      error => {
        // console.error('Error sending Rating to backend:', error);
      }
    );
  }

// Adds movie to a User's Watch History and updates the movie page to reflect that
// the movie was watched.
  addToWatchHistory(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'addWatchHistory';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        // console.log("This is the response:", response);
        // console.log('Watch History successfully sent to backend:', response);
        const WatchHistoryResponse: WatchHistory = <WatchHistory><unknown>response;
        this.watchDate = WatchHistoryResponse.watch_datetime;
        this.checkWatchHistory();
      },
      error => {
        // console.error('Error sending Watch History to backend:', error);
      }
    );
  }

// Checks if movie is on User's Watch History. If it is, then reflect the movie page
// to indicate so, and check if the movie is favorited.
  checkWatchHistory(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'hasWatchHistory';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Watch History status sent to backend:', response); */
        this.wasWatched = <Number><unknown>response;
        if(this.wasWatched)
        {
          this.checkFavoriteStatus();
          // console.log("Favorite Status checked");
        }
      },
      error => {
        // console.error('Error sending Watch History to backend:', error);
      }
    );
  }

// Opens warning dialog about the repercussions of removing a movie from the 
// User's Watch History.
  openWarningDialog(): void
  {
    this.dialog.open(WarningRemoveHistory).afterClosed().subscribe(result => {
      // console.log("Dialog closed");
    })
  }

// Removes the movie from the User's Watch History. Also calls a function to remove
// the rating and review for said movie for the User logged in.
  removeWatchHistory(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'removeWatchHistory';
    const headers = { 'Content-Type': 'application/json'}; 
    this.removeReviewRating();
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Watch History has been removed. ', response); */
        this.wasWatched = <Number><unknown>response;
      },
      error => {
        // console.error('Error sending Watch History to backend:', error);
      }
    );
  }

// Removes the rating and review for a movie depending on the User logged in.
  removeReviewRating(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId}
    const apiUrl = environment.baseUrl + 'removeReviewRating';
    const headers = { 'Content-Type': 'application/json'}; 
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('Watch History has been removed. ', response); */
        this.rating = 0;
        this.movieReview = "";
      },
      error => {
        // console.error('Error sending Watch History to backend:', error);
      }
    );
  }

// Toggles the favorite button for a movie and sends the updated value to the API.
  toggleFavorite(): void {
    const userMovie: WatchHistory = {
      user_id: this.userId,
      movie_id: this.movieId,
      watch_datetime: this.watchDate,
      favorite: !this.isFavorite
    };
    
    const apiUrl = environment.baseUrl + 'updateFavorite';
    const headers = { 'Content-Type': 'application/json' };
    
    this.http.post<JSON>(apiUrl, JSON.stringify(userMovie), { 'headers': headers }).subscribe(
      (response) => {
        // console.log('Favorite status successfully updated:', response);
        this.isFavorite = !this.isFavorite;
      },
      error => {
        // console.error('Error updating favorite status:', error);
      }
    );
  }

// Checks if the movie is favorited by the User and changes the Favorite value on
// the movie page.
  checkFavoriteStatus(): void {
    const userMovie: UserMovieStats = {user_id: this.userId, movie_id: this.movieId};
    const apiUrl = environment.baseUrl + 'checkFavorite';
    const headers = { 'Content-Type': 'application/json' };
  
    this.http.post<any>(apiUrl, JSON.stringify(userMovie), { 'headers': headers }).subscribe(
      (response) => {
        // console.log('Checking favorite status', response);
        if (response && response.favorite !== undefined) {
          this.isFavorite = response.favorite;
        } else {
          // console.error('Invalid response format');
        }
      },
      error => {
        // console.error('Error checking favorite status', error);
      }
    );
  }  

// Adjusts the star rating off a movie based on the User logged in.
  starRating(score: number) {
    this.rating = score;
    // console.log("Rating: ", this.rating);

    const MovieRating: Rating = {user_id: this.userId, movie_id: this.movieId, movie_rating: this.rating};

    // console.log(MovieRating);

    this.setRating(MovieRating);
    
  }

// Adjusts the number of filled in stars on the rating of the movie based on 
// the rating value the User gives the movie.
  showStar(id:number){
    if (this.rating >= id + 1) {
      return 'star';
    }

    else {
      return 'star_border';
    }
  }

// Enables the review input box so that the User can write a review.
// Also disables the Edit Button, but enables the Save and Cancel buttons.
  activateRevEdit(){
    this.movieReviewTemp = this.movieReview;
    this.disableEdit = true;
    this.disableSave = false;
    this.disableCancel = false;
    this.disableText = false;
  }


// Disables the review input box, Save, and Cancel buttons. Enables the Edit button.
// Sends the inputed Movie review to the API depending if anything was written in the
// input box or not.
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

// Disables the review input box, and the Save and Cancel buttons. Renables the Edit
// Button and reverts the text in the review input box to the original text before
// the Edit button was pressed.
  revertReview(){
    this.movieReview = this.movieReviewTemp;
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCancel = true;
    this.disableText = true;
  }
}

@Component({
  selector: 'warning-remove-history',
  templateUrl: 'warning-remove-history.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  styleUrl: './movie-info.component.css',
})

export class WarningRemoveHistory extends MovieInfoComponent {

// Calls the removeWatchHistory function from above and reloads the site so that
// the User is taken back to their Home page.
  acceptWatchRemoval(){
    this.removeWatchHistory();
    //console.log("Removed Watch History!");
    window.location.reload();
    //this.router.navigate(['/home']);
  }
}
