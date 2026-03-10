import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionHistory } from './version-history';

describe('VersionHistory', () => {
  let component: VersionHistory;
  let fixture: ComponentFixture<VersionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
