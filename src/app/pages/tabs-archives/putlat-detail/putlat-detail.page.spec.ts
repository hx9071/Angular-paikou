import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutlatDetailPage } from './putlat-detail.page';

describe('PutlatDetailPage', () => {
  let component: PutlatDetailPage;
  let fixture: ComponentFixture<PutlatDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutlatDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutlatDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
