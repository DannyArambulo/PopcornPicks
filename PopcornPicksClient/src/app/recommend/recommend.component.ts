import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { MovieDataService } from '../moviedata/movie-data.service';
import { Movie } from '../moviedata/movie';
import { map, Observable, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';

interface MovieArray
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
  imports: [MatButtonModule, MatCardModule, RouterLink, CommonModule, YouTubePlayer],
  templateUrl: './recommend.component.html',
  styleUrl: './recommend.component.css'
})
export class RecommendComponent implements OnInit{

  userId: string = "";
  movieId: number = 0;
  recMovieInfo: MovieArray | undefined;
  movie: MovieInfo | undefined;
  ShowMovieCard: number = 0;
  currMovie$: Observable<Movie> | undefined;
  movieTitle: string = "";
  posterPath: string = "";
  movieDate: string = "";
  trailerKey$: Observable<string | null> | undefined;
  trailerLink: string = "https://www.youtube.com/embed/";
  safeTrailerUrl$: Observable<SafeResourceUrl | null> | undefined = of(null);
  videoLoad = true;

  constructor(private http: HttpClient, public auth: AuthService, private router: Router, private movieData: MovieDataService, private sanit: DomSanitizer) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        this.userId = user.sub;
        // console.log('User ID:', this.userId);
      }
    });
}

recommendMovie(){
    const apiUrl = environment.baseUrl + 'recMovie';
    const headers = { 'Content-Type': 'text/plain'}; 
    this.http.post<JSON>(apiUrl, this.userId , {'headers': headers}).subscribe(
      (response) => {
        /* console.log("This is the response:", response);
        console.log('recMovieInfo successfully sent to backend:', response); */
        this.recMovieInfo = <MovieArray><unknown>response;

        if(this.recMovieInfo.movie_results.length === 0)
        {
          // console.log("No recommendations, trying again.")
          this.recommendMovie();
        }
        
        else
        {
          this.movie = <MovieInfo><unknown>this.recMovieInfo.movie_results[0];
          this.movieId = this.movie.id;
          this.movieData.setMovieId(this.movieId);
          this.movieRec();
        }
      },
      error => {
        // console.error('Error getting RecMovieInfo to backend:', error);
      }
    );
}

movieRec()
{
  this.videoLoad = false;
  this.currMovie$ = this.movieData.getMovie();
  this.getTrailer();
  this.ShowMovieCard = 1;
}

getTrailer()
{
  
  this.trailerKey$ = this.currMovie$?.pipe
  (
    map((movie: Movie) => {
      // console.log("Removed previous video");
      let videoArray = movie.videos.results;
      for(let i = videoArray.length - 1; i >= 0; i--)
      {
        if(videoArray[i].type == "Trailer")
        {
          // console.log('Found the trailer!!');
          return videoArray[i].key;
        }

        else;
      }

      return null;
    }),
  )
}


}
