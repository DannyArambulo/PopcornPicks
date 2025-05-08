import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../environments/environment';

// Interface defining the structure of a movie object
interface Movie {
  title: string;
  overview: string;
  release_date: string;
  id: number;
  poster_path: string;
}

// Interface for the response from TMDb API
interface TMDbResponse {
  // Array of movies matching the search query
  results: Movie[];
}

@Component({
  selector: 'app-searchresults',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    RouterLink
  ],
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchResultsComponent implements OnInit {
  // Property to store the search query string
  query: string = '';
  // Array to store search results
  movies: Movie[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Subscribe to query parameters changes
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      // If query is not empty
      if (this.query) {
        // Call search movies method
        this.searchMovies();
      }
    });
  }

  // Method to fetch movie search results from the API
  searchMovies() {
    this.http.get<TMDbResponse>(environment.baseUrl + `search?query=${this.query}`)
      .subscribe(response => {
        // Puts search results into movies array
        this.movies = response.results;
      });
  }
}
