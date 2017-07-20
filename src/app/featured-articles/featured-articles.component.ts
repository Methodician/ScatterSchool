import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-featured-articles',
  templateUrl: './featured-articles.component.html',
  styleUrls: ['./featured-articles.component.css'],
  providers: [ArticleService]
})
export class FeaturedArticlesComponent implements OnInit {
  featuredArticles;
  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.featuredArticles = this.articleService.getAllFeatured();
  }


}
