import { TestBed, inject } from '@angular/core/testing';

import { ParticlesConfigService } from './particles-config.service';

describe('ParticlesConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParticlesConfigService]
    });
  });

  it('should be created', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
    expect(service).toBeTruthy();
  }));
});
