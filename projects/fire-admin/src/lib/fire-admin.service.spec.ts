import { TestBed } from '@angular/core/testing';

import { FireAdminService } from './fire-admin.service';

describe('FireAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireAdminService = TestBed.get(FireAdminService);
    expect(service).toBeTruthy();
  });
});
