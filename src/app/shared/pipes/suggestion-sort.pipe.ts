import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suggestionSort'
})
export class SuggestionSortPipe implements PipeTransform {

  transform(suggestions: any[], sortType?: SortOptions): any {
    if (!suggestions) {
      return null;
    }
    switch (sortType) {
      case SortOptions.upvotes:
        return suggestions.sort((a, b) => {
          return b.voteCount - a.voteCount;
        });
      case SortOptions.newest:
        return suggestions.sort((a, b) => {
          return b.lastUpdated - a.lastUpdated;
        });
      case SortOptions.oldest:
        return suggestions.sort((a, b) => {
          return a.lastUpdated - b.lastUpdated;
        });
      default:
        return suggestions;
    }
  }
}

export enum SortOptions {
  'upvotes' = 1,
  'newest',
  'oldest'
}
