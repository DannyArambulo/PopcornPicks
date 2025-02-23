import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { environment } from '../../environments/environment';

interface Genre {
  id: number;
  name: string;
}


interface TMDbResponse {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genres: Genre[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {

  movie: Movie = 
  {
    movieId: 0,
    movieTitle: "",
    movieDate: "",
    movieOverview: "",
    moviePoster: "",
    movieGenres: [],
  };

  constructor(private http: HttpClient) { }

  getMovie() {
    this.http.get<TMDbResponse>(environment.baseUrl + `movie?id=${this.getMovieId()}`)
    .subscribe(response => {
       this.setTitle(response.title);
       this.setDate(response.release_date);
       this.setOverview(response.overview);
       this.setPoster(response.poster_path);
       this.setGenres(response.genres.map((genre: Genre) => genre.name));
      });

      return this.movie;
  }

  getMovieId()
  {
    return this.movie.movieId;
  }

  setMovieId(inputId: number)
  {
    this.movie.movieId = inputId;
  }

  getTitle()
  {
    return this.movie.movieTitle;
  }

  setTitle(titleInput: string)
  {
    this.movie.movieTitle = titleInput;
  }

  getDate()
  {
    return this.movie.movieDate;
  }

  setDate(dateInput: string)
  {
    this.movie.movieDate = dateInput;
  }

  getOverview()
  {
    return this.movie.movieOverview;
  }

  setOverview(overviewInput: string)
  {
    this.movie.movieOverview = overviewInput;
  }

  getPoster()
  {
    return this.movie.moviePoster;
  }

  setPoster(posterInput: string)
  {
    this.movie.moviePoster = posterInput;
  }

  getGenres()
  {
    return this.movie.movieGenres
  }

  setGenres(genreInput: string[])
  {
    this.movie.movieGenres = genreInput;
  }
  
}