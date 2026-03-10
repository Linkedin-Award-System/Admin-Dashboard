import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  template: `
    <div class="pdf-container">
      <object [data]="src | safeUrl" type="application/pdf" width="100%" height="100%">
        <div class="pdf-fallback">
          <p>It appears you don't have a PDF plugin for this browser. No biggie... you can <a [href]="src">click here to download the PDF file.</a></p>
        </div>
      </object>
    </div>
  `,
  styles: `
    .pdf-container {
      width: 100%;
      height: 100%;
      background-color: white;
    }
    .pdf-fallback {
      padding: 20px;
      color: #333;
      text-align: center;
    }
  `
})
export class PdfViewerComponent implements OnInit {
  @Input() src: string = '';

  constructor() {}

  ngOnInit(): void {}
}
