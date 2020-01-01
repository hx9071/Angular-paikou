import { TestBed } from '@angular/core/testing';

import { FiletransferService } from './filetransfer.service';

describe('FiletransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiletransferService = TestBed.get(FiletransferService);
    expect(service).toBeTruthy();
  });
});
