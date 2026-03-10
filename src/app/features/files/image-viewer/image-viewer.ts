import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-container">
      <img [src]="src" alt="File preview" class="preview-image">
    </div>
  `,
  styles: `
    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
    }
    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    }
  `
})
export class ImageViewerComponent {
  @Input() src: string = '';
}
