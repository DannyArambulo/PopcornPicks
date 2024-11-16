import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  id: number;
}

interface TMDbResponse {
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
  query: string = '';
  movies: Movie[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      if (this.query) {
        this.searchMovies();
      }
    });
  }

  searchMovies() {
    this.http.get<TMDbResponse>(`http://127.0.0.1:5000/search?query=${this.query}`)
      .subscribe(response => {
        this.movies = response.results;
      });
  }
}
