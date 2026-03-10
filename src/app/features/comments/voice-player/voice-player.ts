import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import WaveSurfer from 'wavesurfer.js';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';

@Component({
  selector: 'app-voice-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TimeFormatPipe],
  template: `
    <div class="voice-player">
      <button mat-icon-button (click)="togglePlay()" class="play-btn">
        <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
      </button>

      <div class="waveform-container" #waveformContainer></div>

      <div class="time-info">
        <span>{{ currentTime | timeFormat }}</span>
      </div>
    </div>
  `,
  styles: `
    .voice-player {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f1f3f4;
      border-radius: 20px;
      min-width: 250px;
      max-width: 100%;
    }
    .waveform-container {
      flex: 1;
      height: 30px;
      cursor: pointer;
    }
    .play-btn {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .play-btn ::ng-deep .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .time-info {
      font-size: 11px;
      color: #666;
      font-family: monospace;
      min-width: 35px;
    }
  `
})
export class VoicePlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() src!: string;
  @ViewChild('waveformContainer') waveformContainer!: ElementRef;

  wavesurfer?: WaveSurfer;
  isPlaying = false;
  currentTime = 0;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initWaveSurfer();
  }

  private initWaveSurfer(): void {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveformContainer.nativeElement,
      waveColor: '#BDBDBD',
      progressColor: '#3f51b5',
      cursorWidth: 0,
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      height: 30,
      normalize: true
    });

    this.wavesurfer.load(this.src);

    this.wavesurfer.on('audioprocess', () => {
      this.currentTime = this.wavesurfer!.getCurrentTime();
    });

    this.wavesurfer.on('play', () => this.isPlaying = true);
    this.wavesurfer.on('pause', () => this.isPlaying = false);
    this.wavesurfer.on('finish', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.wavesurfer?.seekTo(0);
    });
  }

  togglePlay(): void {
    this.wavesurfer?.playPause();
  }

  ngOnDestroy(): void {
    this.wavesurfer?.destroy();
  }
}
