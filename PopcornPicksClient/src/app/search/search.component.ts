import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieSearchService } from '../movie-search/movie-search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule],
  styleUrl: './search.component.css',
  template: `
    <input [(ngModel)]="query" (input)="onSearch()" placeholder="Search Movies..."/>
    <div *ngIf="results.length">
      <ul>
        <li *ngFor="let movie of results">{{ movie.title }}</li>
      </ul>
    </div>
  `,
})
export class SearchComponent {
  query: string = '';
  results: any[] = [];

  constructor(private movieSearchService: MovieSearchService) {}

  onSearch(): void {
    if (this.query) {
      this.movieSearchService.searchMovies(this.query).subscribe((data) => {
        this.results = data;
      });
    } else {
      this.results = [];
    }
  }
}
