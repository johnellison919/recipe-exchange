import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { VoteService } from './vote.service';

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(VoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
