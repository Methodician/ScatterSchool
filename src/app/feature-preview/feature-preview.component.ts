import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';

@Component({
  selector: 'app-feature-preview',
  templateUrl: './feature-preview.component.html',
  styleUrls: ['./feature-preview.component.scss']
})

export class FeaturePreviewComponent implements OnInit {
  @Input() articleData: any;
  author;
  articleCoverImageUrl;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    this.articleService.getAuthorByKey(this.articleData.authorKey).subscribe(author => {
      this.author = author;
    });
    this.getArticleCoverImage(this.articleData.$key);
  }

  navigateToArticleDetail() {
    this.articleService.navigateToArticleDetail(this.articleData.$key);
  }

  navigateToProfile() {
    this.articleService.navigateToProfile(this.articleData.authorKey);
  }

  getArticleCoverImage(articleKey) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc.getImage(articleKey, basePath).subscribe(articleData => {
      if (articleData.url) {
        this.articleCoverImageUrl = articleData.url;
      }
    });
  }
}
