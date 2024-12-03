import { TestBed } from '@angular/core/testing';

import { WatchHistoryService } from './watch-history.service';

describe('WatchHistoryService', () => {
  let service: WatchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
