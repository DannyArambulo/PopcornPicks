import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MovieDataService {

  private movieIdSub = new BehaviorSubject<number | null>(null);
  private apiUrl = environment.baseUrl + "movie?id=";

  constructor(private http: HttpClient) { }

  setMovieId(inputId: number)
  {
    this.movieIdSub.next(inputId);
  }

  getMovie(): Observable<Movie>{
    /* this.http.get<TMDbResponse>(environment.baseUrl + `movie?id=${this.getMovieId()}`)
    .subscribe(response => {
       this.setTitle(response.title);
       this.setDate(response.release_date);
       this.setOverview(response.overview);
       this.setPoster(response.poster_path);
       this.setGenres(response.genres.map((genre: Genre) => genre.name));
      }); */

      return this.movieIdSub.asObservable().pipe(
        filter(inputId => inputId !== null),
        switchMap(inputId => {
          // console.log("getting movie data");
          return this.http.get<Movie>(`${this.apiUrl}${inputId}`).pipe(
            // tap(response => console.log('API Response:', response.poster_path)),
          );
        })
      );
    }
}