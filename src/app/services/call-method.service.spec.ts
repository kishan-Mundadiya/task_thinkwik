import { TestBed } from '@angular/core/testing';

import { CallMethodService } from './call-method.service';

describe('CallMethodService', () => {
  let service: CallMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
