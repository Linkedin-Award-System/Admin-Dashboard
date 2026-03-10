import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  name: 'appDragDrop',
  standalone: true
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostBinding('class.drag-over') dragOver = false;

  constructor() { }

  /**
   * Listens for the dragover event.
   * @param event Drag event
   */
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  /**
   * Listens for the dragleave event.
   * @param event Drag event
   */
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  /**
   * Listens for the drop event.
   * @param event Drag event
   */
  @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
