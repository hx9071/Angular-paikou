import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTrackPage } from './tabs-track.page';

describe('TabsTrackPage', () => {
  let component: TabsTrackPage;
  let fixture: ComponentFixture<TabsTrackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsTrackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTrackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
