import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateTags'
})
export class TruncateTagsPipe implements PipeTransform {

  transform(inputArray: string[], args?: number): string[] {
    const max = args ? args : 100;

    if (!inputArray || inputArray === []) {
      return;
    }

    let totalLength = 0;
    const newArray = [];

    for (const tag of inputArray) {
      totalLength += tag.length;
      if (totalLength >= max) {
        return newArray;
      }
      newArray.push(tag);
    }

    return newArray || null;
  }
}
