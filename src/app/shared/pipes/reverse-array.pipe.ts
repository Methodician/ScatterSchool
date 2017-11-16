import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseArray'
})
export class ReverseArrayPipe implements PipeTransform {

  transform(value: any[]): any[] {
    if (value)
      return value.reverse();
  }

}
