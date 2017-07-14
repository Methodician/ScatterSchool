import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.css'],
  providers: [ArticleService]
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: any;
  @Input() authorKey;
  author;
  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.author = this.articleService.getAuthorById(this.authorKey);
  }

  navigateToArticleDetail() {
    this.router.navigate([`articledetail/${this.articleData.$key}`]);
  }
}
