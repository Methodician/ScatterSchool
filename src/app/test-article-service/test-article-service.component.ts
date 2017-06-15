import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-test-article-service',
  templateUrl: './test-article-service.component.html',
  styleUrls: ['./test-article-service.component.css'],
  providers: [ArticleService]
})
export class TestArticleServiceComponent implements OnInit {

  allArticles;
  constructor(private articleService: ArticleService) { }
  
  ngOnInit() {
    this.allArticles = this.articleService.getAllArticles();
  }

  setFeatured(articleID: string)
  {
    this.articleService.setFeaturedArticle(articleID);
  }
}
