import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface defining the structure of a watch history item
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
  // Initialize watch history with an empty array
  private watchHistory$ = new BehaviorSubject<WatchHistoryItem[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}
  // Fetches the user's watch history from the backend
  loadWatchHistory(): void {
    this.auth.user$.subscribe((user) => {
      // Only proceed if user is authenticated and has a sub identifier
      if (user && user.sub) {
        const userId = user.sub;
        const apiUrl = environment.baseUrl + 'getWatchHistory';
        // Make POST request to fetch watch history for this user
        this.http
          .post<{ user_id: string; watch_history: WatchHistoryItem[] }>(apiUrl, { user_id: userId })
          .subscribe((response) => {
            const watchHistory = response.watch_history.sort((a, b) => 
              // Sort watch history by date (newest first)
              new Date(b.watch_date).getTime() - new Date(a.watch_date).getTime()
            );
            // Update the array with the sorted watch history
            this.watchHistory$.next(watchHistory);
            // Load movie details for each history item
            watchHistory.forEach((item) => this.loadMovieDetails(item));
          });
      }
    });
  }
  // Fetches detailed movie information for a watch history item from TMDb api
  private loadMovieDetails(item: WatchHistoryItem): void {
    const apiUrl = environment.baseUrl + `movie?id=${item.movie_id}`;
    this.http.get<any>(apiUrl).subscribe((movieDetails) => {
      // Update the watch history item with movie details
      item.title = movieDetails.title;
      item.poster_path = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
      item.overview = movieDetails.overview;
      item.release_date = movieDetails.release_date;
      this.watchHistory$.next(this.watchHistory$.getValue());
    });
  }
  // Returns an observable of the watch history that components can subscribe to
  getWatchHistory(): Observable<WatchHistoryItem[]> {
    return this.watchHistory$.asObservable();
  }
  // Method to update the favorite status of a watch history item
  toggleFavorite(movie: WatchHistoryItem): void {
    // Toggles the movie's favorite status
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