import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeFlag'
})
export class SafeFlagPipe implements PipeTransform {

  transform(value: string): string {
    return value;
  }

}
