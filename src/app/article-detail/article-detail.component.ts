import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  providers: [ArticleService]
})
export class ArticleDetailComponent implements OnInit {
  @Input() articleData: Object;
  @Input() articleKey;
  articleDetails;
  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articleDetails = this.articleService.getArticleById(this.articleKey);
  }

}
