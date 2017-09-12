import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-latest-articles',
  templateUrl: './latest-articles.component.html',
  styleUrls: ['./latest-articles.component.scss']
})
export class LatestArticlesComponent implements OnInit {
  latestArticles;
  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articleService.getLatest().subscribe(latest => {
      this.latestArticles = latest;
    });
  }

}
