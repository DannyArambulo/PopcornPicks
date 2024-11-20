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
  disableEdit: boolean = false;
  disableSave: boolean = true;
  disableCancel: boolean = true;
  disableText: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.movieId = params['id'];
      if (this.movieId) {
        this.getMovie();
      }
    });
  }

  getMovie() {
    this.http.get<TMDbResponse>(`http://127.0.0.1:5000/movie?id=${this.movieId}`)
    .subscribe(response => {
       console.log("Title is: " + response.title);
       console.log("Date is: " + response.release_date);
       console.log("Overview is: " + response.overview);
       console.log("Poster is: " + response.poster_path);
       console.log("Genres are: " + response.genres);
       this.movieTitle = response.title;
       this.movieDate = response.release_date;
       this.movieOverview = response.overview;
       this.posterPath = response.poster_path;
       this.movieGenres = response.genres.map((genre: Genre) => genre.name);
      });
  }

  starRating(score: number) {
    this.rating = score;
    console.log("Rating: ", this.rating)
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
    
  }

  revertReview(){
    this.movieReview = this.movieReviewTemp;
    this.disableEdit = false;
    this.disableSave = true;
    this.disableCancel = true;
    this.disableText = true;
  }
}
