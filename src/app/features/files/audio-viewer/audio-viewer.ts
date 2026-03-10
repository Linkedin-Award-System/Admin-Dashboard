import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import WaveSurfer from 'wavesurfer.js';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';

@Component({
  selector: 'app-audio-viewer',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSliderModule, 
    MatMenuModule, 
    TimeFormatPipe
  ],
  template: `
    <div class="audio-player-container">
      <div class="waveform-container" #waveformContainer></div>
      
      <div class="controls-container">
        <div class="time-display">
          <span>{{ currentTime | timeFormat }}</span>
          <span class="divider">/</span>
          <span>{{ duration | timeFormat }}</span>
        </div>

        <div class="main-controls">
          <button mat-icon-button (click)="skipBackward()">
            <mat-icon>replay_10</mat-icon>
          </button>
          
          <button mat-fab color="primary" (click)="togglePlay()" class="play-btn">
            <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          
          <button mat-icon-button (click)="skipForward()">
            <mat-icon>forward_10</mat-icon>
          </button>
        </div>

        <div class="secondary-controls">
           <button mat-icon-button [matMenuTriggerFor]="volMenu">
             <mat-icon>{{ getVolumeIcon() }}</mat-icon>
           </button>
           <mat-menu #volMenu="matMenu">
             <div class="volume-slider-container" (click)="$event.stopPropagation()">
                <mat-slider min="0" max="1" step="0.1" (input)="onVolumeChange($event)">
                  <input matSliderThumb [value]="volume">
                </mat-slider>
             </div>
           </mat-menu>

           <div class="speed-control">
             <button mat-button (click)="changeSpeed()">{{ playbackSpeed }}x</button>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .audio-player-container {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      width: 100%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .waveform-container {
      width: 100%;
      height: 128px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 8px;
    }
    .controls-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .time-display {
      font-family: 'Roboto Mono', monospace;
      font-size: 14px;
      color: #5f6368;
      min-width: 100px;
    }
    .divider {
      margin: 0 4px;
    }
    .main-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .play-btn {
      transform: scale(1.1);
    }
    .secondary-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .volume-slider-container {
      padding: 10px 15px;
      width: 150px;
    }
    .speed-control button {
      font-weight: bold;
      min-width: 50px;
    }
  `
})
export class AudioViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() src!: string;
  @ViewChild('waveformContainer') waveformContainer!: ElementRef;

  wavesurfer?: WaveSurfer;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 0.8;
  playbackSpeed = 1;
  speeds = [1, 1.25, 1.5, 2, 0.5, 0.75];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initWaveSurfer();
  }

  private initWaveSurfer(): void {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveformContainer.nativeElement,
      waveColor: '#D1D1D1',
      progressColor: '#3f51b5',
      cursorColor: '#3f51b5',
      barWidth: 2,
      barRadius: 3,
      height: 128,
      normalize: true,
    });

    this.wavesurfer.load(this.src);

    this.wavesurfer.on('ready', () => {
      this.duration = this.wavesurfer!.getDuration();
    });

    this.wavesurfer.on('audioprocess', () => {
      this.currentTime = this.wavesurfer!.getCurrentTime();
    });

    this.wavesurfer.on('play', () => this.isPlaying = true);
    this.wavesurfer.on('pause', () => this.isPlaying = false);
    this.wavesurfer.on('finish', () => this.isPlaying = false);
  }

  togglePlay(): void {
    this.wavesurfer?.playPause();
  }

  skipBackward(): void {
    this.wavesurfer?.skip(-10);
  }

  skipForward(): void {
    this.wavesurfer?.skip(10);
  }

  onVolumeChange(event: any): void {
    this.volume = event.target.value;
    this.wavesurfer?.setVolume(this.volume);
  }

  changeSpeed(): void {
    const currentIndex = this.speeds.indexOf(this.playbackSpeed);
    const nextIndex = (currentIndex + 1) % this.speeds.length;
    this.playbackSpeed = this.speeds[nextIndex];
    this.wavesurfer?.setPlaybackRate(this.playbackSpeed);
  }

  getVolumeIcon(): string {
    if (this.volume === 0) return 'volume_off';
    if (this.volume < 0.5) return 'volume_down';
    return 'volume_up';
  }

  ngOnDestroy(): void {
    this.wavesurfer?.destroy();
  }
}
