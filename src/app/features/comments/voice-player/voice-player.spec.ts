import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicePlayer } from './voice-player';

describe('VoicePlayer', () => {
  let component: VoicePlayer;
  let fixture: ComponentFixture<VoicePlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoicePlayer],
    }).compileComponents();

    fixture = TestBed.createComponent(VoicePlayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
