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
  @Input() articleData: Object;
  @Input() authorKey;
  author;
  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.author = this.articleService.getAuthorById(this.authorKey);
  }

}
