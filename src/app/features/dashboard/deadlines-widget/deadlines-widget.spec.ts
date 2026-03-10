import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlinesWidget } from './deadlines-widget';

describe('DeadlinesWidget', () => {
  let component: DeadlinesWidget;
  let fixture: ComponentFixture<DeadlinesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadlinesWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(DeadlinesWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
