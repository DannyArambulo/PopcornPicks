import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

// Interface defining the structure of a movie object
interface Movie {
  title: string;
  overview: string;
  release_date: string;
}

// Interface for the response from TMDb API
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
    MatIconModule,
    MatListModule,
    RouterModule
  ]
})
export class SearchComponent {
  // Property to store the search query string
  query: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Method to search movies
  searchMovies() {
    // If query is not empty
    if (this.query) {
        // Navigates to search results page with the query as a parameter
      this.router.navigate(['/searchresults'], { queryParams: { query: this.query } });
      // Clear search field after navigation
      this.query = "";
    }
  }
}