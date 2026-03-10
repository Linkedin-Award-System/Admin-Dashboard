import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioViewer } from './audio-viewer';

describe('AudioViewer', () => {
  let component: AudioViewer;
  let fixture: ComponentFixture<AudioViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
