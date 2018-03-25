import { TestBed, inject } from '@angular/core/testing';

import { ClassesService } from './classes.service';

describe('ClassesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassesService]
    });
  });

  it('should be created', inject([ClassesService], (service: ClassesService) => {
    expect(service).toBeTruthy();
  }));
});
