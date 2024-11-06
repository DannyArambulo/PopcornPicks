import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

interface Movie {
  title: string;
  overview: string;
  release_date: string;
}

interface TMDbResponse {
  results: Movie[];
}
@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [
    CommonModule,
    FormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatCardModule, 
    MatListModule]
})
export class SearchComponent {
  query: string = '';
  movies: Movie[] = [];

  constructor(private http: HttpClient) {}

  searchMovies() {
    if (this.query) {
      this.http.get<TMDbResponse>(`http://127.0.0.1:5000/search?query=${this.query}`)
        .subscribe(response => {
          console.log(response);
          this.movies = response.results;
        })
    }
  }
}