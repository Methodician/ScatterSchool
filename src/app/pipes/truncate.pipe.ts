import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, args?: number): any {
    let max = args ? args : 30;
    if (value.length > max) {
      return `${value.substr(0,max)}...`
    }
    return value;
  }

}
