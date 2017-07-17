import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-feature-preview',
  templateUrl: './feature-preview.component.html',
  styleUrls: ['./feature-preview.component.css'],
  providers: [ArticleService]
})

export class FeaturePreviewComponent implements OnInit {
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
    //this.router.navigate([`articledetail/${this.articleData.$key}`]);
    this.articleService.navigateToArticleDetail(this.articleData.$key);
  }

  navigateToAuthor() {
    this.articleService.navigateToAuthor(this.articleData.$key);
  }
}
