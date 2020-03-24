import { TestBed } from '@angular/core/testing';

import { GoogleOauthService } from './google-oauth.service';

describe('GoogleOauthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleOauthService = TestBed.get(GoogleOauthService);
    expect(service).toBeTruthy();
  });
});
