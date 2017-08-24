import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suggestionSort'
})
export class SuggestionSortPipe implements PipeTransform {

  transform(suggestions: any, sortType?: any): any {
    if(!suggestions) return null;
    
    switch(sortType){
      case 'upvotes':
        return suggestions.sort((a, b) => {
          return b.voteCount - a.voteCount
        });
      default:
        return suggestions;
    }
    
  }

}
