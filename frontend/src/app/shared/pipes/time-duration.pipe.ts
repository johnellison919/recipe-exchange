import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration',
})
export class TimeDurationPipe implements PipeTransform {
  transform(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}`;
    }

    return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes} min${
      remainingMinutes !== 1 ? 's' : ''
    }`;
  }
}
