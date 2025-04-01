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
    MatIconModule,
    MatListModule,
    RouterModule
  ]
})
export class SearchComponent {
  query: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  searchMovies() {
    if (this.query) {
      this.router.navigate(['/searchresults'], { queryParams: { query: this.query } });
      this.query = "";
    }
  }
}