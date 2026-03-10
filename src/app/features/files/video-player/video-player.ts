import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container">
      <video #videoPlayer class="video-js vjs-big-play-centered vjs-theme-city" playsinline preload="auto">
        <source [src]="src" type="video/mp4">
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
        </p>
      </video>
    </div>
  `,
  styles: `
    .video-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .video-js {
      width: 100%;
      height: 100%;
    }
  `
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoElement!: ElementRef;
  @Input() src: string = '';
  
  player?: Player;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.player = videojs(this.videoElement.nativeElement, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2]
    }, () => {
      console.log('Video.js player is ready');
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
