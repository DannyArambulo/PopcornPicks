import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Movie
{
  movie_results: MovieInfo[]
}

interface MovieInfo
{
  id: number;
}

@Component({
  selector: 'app-recommend',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './recommend.component.html',
  styleUrl: './recommend.component.css'
})
export class RecommendComponent implements OnInit{

  userId: string = "";
  movieId: number = 0;
  recMovieInfo: Movie | undefined;
  movie: MovieInfo | undefined;

  constructor(private http: HttpClient, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        console.log('User ID:', this.userId);
      }
    });
}

recommendMovie(){
    const apiUrl = 'http://localhost:5000/recMovie';
    const headers = { 'Content-Type': 'text/plain'}; 
    this.http.post<JSON>(apiUrl, this.userId , {'headers': headers}).subscribe(
      (response) => {
        console.log("This is the response:", response);
        console.log('recMovieInfo successfully sent to backend:', response);
        this.recMovieInfo = <Movie><unknown>response;
        this.movie = <MovieInfo><unknown>this.recMovieInfo.movie_results[0];
        this.movieId = this.movie.id;
        this.router.navigate([ '/movie' ], { queryParams: { id:this.movieId } })
      },
      error => {
        console.error('Error getting RecMovieInfo to backend:', error);
      }
    );
}

}
