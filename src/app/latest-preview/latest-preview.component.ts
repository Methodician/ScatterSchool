import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.css']
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: any;
  @Input() authorKey;
  author;

  constructor(
    private articleSvc: ArticleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.articleSvc.getAuthorById(this.articleData.authorId).subscribe(author => {
     this.author = author;
   });
  }

  navigateToArticleDetail() {
    this.articleSvc.navigateToArticleDetail(this.articleData.$key);
  }

  navigateToAuthor() {
    this.articleSvc.navigateToAuthor(this.articleData.authorId);
  }
}
