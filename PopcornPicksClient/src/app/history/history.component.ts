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
    this.route.queryParams.subscribe((params) => {
      this.filter = params['filter'] || 'all';
    });

    this.watchHistoryService.loadWatchHistory();
    this.watchHistoryService.getWatchHistory().subscribe((history) => {
      this.watchHistory = history;
    });
  }

  filteredWatchHistory(): WatchHistoryItem[] {
    if (this.filter === 'favorites') {
      return this.watchHistory.filter((item) => item.favorite);
    }
    return this.watchHistory;
  }

  toggleFavorite(event: MouseEvent, item: WatchHistoryItem): void {
    event.stopPropagation();
    this.watchHistoryService.toggleFavorite(item);
  }
}
