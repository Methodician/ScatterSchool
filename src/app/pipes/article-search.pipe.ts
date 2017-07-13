import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articleSearch'
})
export class ArticleSearchPipe implements PipeTransform {

  transform(articlesToFilter: any, searchString?: string): any {
    if (searchString) {
      var query = searchString.toUpperCase();
      var searchResults = new Array();
    }
    if (articlesToFilter) {
      if (!searchString) {
        return articlesToFilter;
      } else {
        for (let article of articlesToFilter) {
          let title = article.title.toUpperCase();
          if (title.includes(query)) {
            searchResults.push(article);
          } else if (this.checkTags(article.tags, query)) {
            searchResults.push(article);
          } else if (this.checkBody(article.body, query)) {
            searchResults.push(article);
          }
        }
        console.log(searchResults);
        return searchResults;
      }
    }
  }

  checkTags(tags: any, query: string) {
    for (let nextTag in tags) {
      let tag = nextTag.toUpperCase();
      if (tag.includes(query)) {
        return true;
      }
    }
    return false;
  }

  checkBody(bodyToCheck: string, query: string) {
    let body = bodyToCheck.toUpperCase();
    if (body.includes(query))
      return true;
    return false;
  }
}
