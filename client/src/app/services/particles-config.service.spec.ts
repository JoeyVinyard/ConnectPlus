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
  it('should contain height', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.height).toBeDefined();
  }));
  it('should have correct height', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.height).toEqual(100);
  }));
  it('should contain width', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.width).toBeDefined();
  }));
  it('should have correct width', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.width).toEqual(100);
  }));
  it('should contain params', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.params).toBeDefined();
  }));
  it('should contain style', inject([ParticlesConfigService], (service: ParticlesConfigService) => {
  	expect(service.style).toBeDefined();
  }));
});
