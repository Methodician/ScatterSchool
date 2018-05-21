import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articleRelated',
  pure: false
})
export class ArticleRelatedPipePipe implements PipeTransform {

  transform(articlesToFilter: any, relatedArticles?: any[]): any {
    if (articlesToFilter){
      if(!relatedArticles){
        return;
      } else {
        const articleResults = articlesToFilter.filter(obj => {
          return relatedArticles.includes(obj.articleId);
        })
        return articleResults;
      }
    }
  }

}
