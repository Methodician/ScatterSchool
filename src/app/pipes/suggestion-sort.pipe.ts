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
          return b.voteCount - a.voteCount;
        });
      case 'newest':
        return suggestions.sort((a,b) => {
          return b.lastUpdated - a.lastUpdated;
        });
      case 'oldest':
        return suggestions.sort((a,b) => {
          return a.lastUpdated - b.lastUpdated;
        });
      default:
        return suggestions;
    }
    
  }

}
