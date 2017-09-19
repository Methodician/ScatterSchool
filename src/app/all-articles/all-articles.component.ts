import { Component, OnInit } from '@angular/core';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.css'],
})
export class AllArticlesComponent implements OnInit {
  articles;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articleService.getAllArticles().subscribe( response => {
      this.articles = response;
    });
  }

}
