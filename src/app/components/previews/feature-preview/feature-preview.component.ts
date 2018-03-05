import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { ArticleDetailFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'app-feature-preview',
  templateUrl: './feature-preview.component.html',
  styleUrls: ['./feature-preview.component.scss']
})

export class FeaturePreviewComponent implements OnInit {
  @Input() articleData: ArticleDetailFirestore;
  author;
  articleCoverImageUrl;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    this.articleService
    .getAuthor(this.articleData.authorId)
    .subscribe(author => {
        this.author = author;
      });
    this.getArticleCoverImage();
  }

  navigateToArticleDetail() {
    this.articleService.navigateToArticleDetail(this.articleData.articleId);
  }

  navigateToProfile() {
    this.articleService.navigateToProfile(this.articleData.authorId);
  }

  getArticleCoverImage() {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc
      .getImage(this.articleData.articleId, basePath)
      .subscribe(imageData => {
        if (imageData.url) {
          this.articleCoverImageUrl = imageData.url;
        }
      });
  }
}
