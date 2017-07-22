import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'article-search-preview',
  templateUrl: './article-search-preview.component.html',
  styleUrls: ['./article-search-preview.component.scss']
})
export class ArticleSearchPreviewComponent implements OnInit {

  @Input() articleData: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleSvc: ArticleService
  ) { }

  ngOnInit() {

  }

  navigateToArticleDetail() {
    this.articleSvc.navigateToArticleDetail(this.articleData.$key);
  }
}
