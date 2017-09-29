import { ArticleService } from './../services/article/article.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-article-history',
  templateUrl: './article-history.component.html',
  styleUrls: ['./article-history.component.scss']
})
export class ArticleHistoryComponent implements OnInit {

  articleKey: string;
  articleHistory;
  articleCount;
  curentArticleIndex = 0;

  constructor(
    private articleSvc: ArticleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['key']) {
        this.articleKey = params['key'];
        this.articleSvc.getAllArticleHistory(this.articleKey).subscribe(history => {
          this.articleHistory = history;
          this.articleCount = history.length;
          this.curentArticleIndex = history.length - 1;
        });
      }
    })

  }

  selectPrevious() {
    if (this.curentArticleIndex > 0)
      this.curentArticleIndex--;
  }

  selectNext() {
    if (this.curentArticleIndex < (this.articleCount - 1))
      this.curentArticleIndex++;
  }

  selectedArticle() {
    if (this.articleHistory)
      return this.articleHistory[this.curentArticleIndex];
  }


}
