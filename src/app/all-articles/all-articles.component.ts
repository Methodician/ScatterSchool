import { Component, OnInit } from '@angular/core';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.css'],
  providers: [ArticleService]
})
export class AllArticlesComponent implements OnInit {
  

  constructor(private articleSvc: ArticleService) { }

  ngOnInit() {
    this.articleSvc.getAllArticles().subscribe(response => {
      
    });
  }

}
