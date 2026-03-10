import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  /**
   * Formats duration in seconds to HH:MM:SS or MM:SS.
   * @param value Duration in seconds
   * @param forceHours Whether to force HH even if 0
   * @returns Formatted string (e.g., '01:23')
   */
  transform(value: number, forceHours: boolean = false): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '00:00';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (hours > 0 || forceHours) {
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    return `${minutesStr}:${secondsStr}`;
  }
}
