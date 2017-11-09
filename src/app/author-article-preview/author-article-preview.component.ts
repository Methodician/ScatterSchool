import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';


@Component({
  selector: 'author-article-preview',
  templateUrl: './author-article-preview.component.html',
  styleUrls: ['./author-article-preview.component.scss']
})
export class AuthorArticlePreviewComponent implements OnInit {

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
