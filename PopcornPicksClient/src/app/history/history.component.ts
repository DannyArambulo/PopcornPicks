import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { WatchHistoryService, WatchHistoryItem } from '../watch-history/watch-history.service';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatFormField, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatListModule, RouterLink, MatTooltipModule]
})
export class HistoryComponent implements OnInit {
  watchHistory: WatchHistoryItem[] = [];
  filter: string = 'all';

  constructor(private route: ActivatedRoute, private watchHistoryService: WatchHistoryService) {}

  ngOnInit(): void {
    // Subscribe to URL query parameters to get the filter value
    // Default to 'all' if no filter parameter is provided
    this.route.queryParams.subscribe((params) => {
      this.filter = params['filter'] || 'all';
    });
    // Load watch history data from watch history service
    this.watchHistoryService.loadWatchHistory();
    this.watchHistoryService.getWatchHistory().subscribe((history) => {
      this.watchHistory = history;
    });
  }
  // Returns filtered watch history items based on the current filter value
  // If filter is 'favorites', returns only favorite items
  // Otherwise returns the complete watch history
  filteredWatchHistory(): WatchHistoryItem[] {
    if (this.filter === 'favorites') {
      return this.watchHistory.filter((item) => item.favorite);
    }
    return this.watchHistory;
  }
  // Stops event propagation to prevent leading to movie page when clicking the heart
  // Calls the watch history service method to toggle the favorite status
  toggleFavorite(event: MouseEvent, item: WatchHistoryItem): void {
    event.stopPropagation();
    this.watchHistoryService.toggleFavorite(item);
  }
}
