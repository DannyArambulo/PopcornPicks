import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface WatchHistoryItem {
  movie_id: number;
  watch_date: string;
  favorite: boolean;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatListModule, MatCheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  watchHistory: WatchHistoryItem[] = [];
  filter: string = 'all';


  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loadWatchHistory();
  }

  loadWatchHistory() {
    this.auth.user$.subscribe(user => {
      if (user && user.sub) {
        const userId = user.sub;
        const apiUrl = 'http://127.0.0.1:5000/getWatchHistory';

        this.http.post<{ user_id: string; watch_history: WatchHistoryItem[] }>(apiUrl, { user_id: userId })
          .subscribe(response => {
            this.watchHistory = response.watch_history;
            
            this.watchHistory.forEach(item => {
              this.fetchMovieDetails(item.movie_id, item);
            });
          });
      }
    });
  }

  fetchMovieDetails(movieId: number, item: WatchHistoryItem) {
    console.log(`Fetching details for movie ID: ${movieId}`); 
    const tmdbApiUrl = `https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}`;

    this.http.get<any>(tmdbApiUrl).subscribe(movieDetails => {
      console.log('Movie details fetched:', movieDetails);

      item.title = movieDetails.title;
      item.poster_path = movieDetails.poster_path;
      item.overview = movieDetails.overview;
      item.release_date = movieDetails.release_date;
    }, error => {
      console.error('Error fetching movie details:', error);
    });
  }

  filteredWatchHistory() {
    if (this.filter === 'favorites') {
      return this.watchHistory.filter(item => item.favorite);
    }
    return this.watchHistory;
  }
}