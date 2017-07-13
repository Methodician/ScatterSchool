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
  allFeatured;
  allLatest;
  searchedArticle;
  constructor(private articleService: ArticleService) { }
  
  ngOnInit() {
    this.allArticles = this.articleService.getAllArticles();
    this.allFeatured = this.articleService.getAllFeatured();
    this.allLatest = this.articleService.getLatest();
    this.searchedArticle = this.articleService.searchArticles("angular2");
    console.log(this.searchedArticle);
  }

  setFeatured(articleKey: string) {
    this.articleService.setFeaturedArticle(articleKey);
  }

  unsetFeatured(articleKey: string) {
    this.articleService.unsetFeaturedArticle(articleKey);
  }

}