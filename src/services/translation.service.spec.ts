import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';



describe('TranslationService', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [
       TranslationService
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: TranslationService = TestBed.get(TranslationService);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
