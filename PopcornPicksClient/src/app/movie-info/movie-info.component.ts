import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
}

interface TMDbResponse {
  result: Movie[];
}

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatButtonModule, MatIconModule, CommonModule, MatInputModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css'
})
export class MovieInfoComponent {

  numStars: number[] = [1,2,3,4,5,6,7,8,9,10];
  rating: number = 0;
  movieId: string = '';
  movies: Movie[] = [];
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
        this.movies = response.result;
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
}
