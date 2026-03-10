import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngStyle]="wrapperStyle">
       <div class="skeleton-shimmer"></div>
    </div>
  `,
  styles: `
    .skeleton-wrapper {
      background-color: #e0e0e0;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
    }
    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '4px';
  @Input() margin: string = '0';

  get wrapperStyle() {
    return {
      width: this.width,
      height: this.height,
      'border-radius': this.borderRadius,
      margin: this.margin
    };
  }
}
