import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-article-search-results',
  templateUrl: './article-search-results.component.html',
  styleUrls: ['./article-search-results.component.scss']
})
export class ArticleSearchResultsComponent implements OnInit {

  @Input() articleData: any;

  allArticles: any;
  searchResults: any;
  queryString: string;
  constructor(
    private articleSvc: ArticleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.articleSvc.getAllArticles().subscribe(articles => {
      for (let article of articles) {
        this.articleSvc.getArticleBodyById(article.bodyId).subscribe(body => {
          article.body = body.$value;
        });
      }
      this.allArticles = articles;
    })
    this.route.params.subscribe(params => {
      if (params['query']) {
        this.queryString = params['query'];
      }
      else console.log('No query found');
    })
  }

  navigateToArticleDetail() {
    this.articleSvc.navigateToArticleDetail(this.articleData.$key);
  }
}
