import { TestBed, inject } from '@angular/core/testing';

import { Facebook.LinkService } from './facebook.link.service';

describe('Facebook.LinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Facebook.LinkService]
    });
  });

  it('should be created', inject([Facebook.LinkService], (service: Facebook.LinkService) => {
    expect(service).toBeTruthy();
  }));
});
