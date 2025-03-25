import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WatchHistoryItem {
  movie_id: number;
  watch_date: string;
  favorite: boolean;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

@Injectable({
  providedIn: 'root',
})
export class WatchHistoryService {
  private watchHistory$ = new BehaviorSubject<WatchHistoryItem[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}

  loadWatchHistory(): void {
    this.auth.user$.subscribe((user) => {
      if (user && user.sub) {
        const userId = user.sub;
        const apiUrl = environment.baseUrl + 'getWatchHistory';
        this.http
          .post<{ user_id: string; watch_history: WatchHistoryItem[] }>(apiUrl, { user_id: userId })
          .subscribe((response) => {
            const watchHistory = response.watch_history.sort((a, b) => 
              new Date(b.watch_date).getTime() - new Date(a.watch_date).getTime()
            );
            this.watchHistory$.next(watchHistory);
            watchHistory.forEach((item) => this.loadMovieDetails(item));
          });
      }
    });
  }

  private loadMovieDetails(item: WatchHistoryItem): void {
    const apiUrl = environment.baseUrl + `movie?id=${item.movie_id}`;
    this.http.get<any>(apiUrl).subscribe((movieDetails) => {
      item.title = movieDetails.title;
      item.poster_path = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
      item.overview = movieDetails.overview;
      item.release_date = movieDetails.release_date;
      this.watchHistory$.next(this.watchHistory$.getValue());
    });
  }

  getWatchHistory(): Observable<WatchHistoryItem[]> {
    return this.watchHistory$.asObservable();
  }

  toggleFavorite(movie: WatchHistoryItem): void {
    movie.favorite = !movie.favorite;
    const apiUrl = environment.baseUrl + 'updateFavorite';
    this.auth.user$.subscribe((user) => {
      if (user && user.sub) {
        const userId = user.sub;
        this.http.post(apiUrl, {
          user_id: userId,
          movie_id: movie.movie_id,
          favorite: movie.favorite,
        }).subscribe(() => console.log('Favorite status updated'));
      }
    });
  }
}