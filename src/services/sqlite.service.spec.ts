import { TestBed } from '@angular/core/testing';

import { SqliteService } from './sqlite.service';

describe('SqliteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqliteService = TestBed.get(SqliteService);
    expect(service).toBeTruthy();
  });
});
