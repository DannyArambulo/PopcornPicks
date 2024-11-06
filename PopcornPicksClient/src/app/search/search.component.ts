import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieSearchService } from '../movie-search/movie-search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule],
  template: `
    <input [(ngModel)]="query" (keyup.enter)="onSearch()" placeholder="Search Movies..."/>
    <div *ngIf="results?.length">
      <mat-card appearance="outlined">
      <ul>
        <li *ngFor="let movie of results">{{ movie.title }}</li>
      </ul>
      </mat-card>
    </div>
  `,
  styles: [``]
})
export class SearchComponent {
  query: string = '';
  results: any[] = [];

  constructor(private movieSearchService: MovieSearchService) {}

  onSearch(): void {
    if (this.query.trim()) {
      this.movieSearchService.searchMovies(this.query).subscribe((data) => {
        this.results = data.results || [];
      });
    }
  }
}