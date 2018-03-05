import { UploadFormComponent } from 'app/components/shared/upload-form/upload-form.component';
import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from 'app/shared/services/upload/upload.service';

@Component({
  selector: 'app-article-cover-image',
  templateUrl: './article-cover-image.component.html',
  styleUrls: ['./article-cover-image.component.scss']
})
export class ArticleCoverImageComponent implements OnInit {
  @Input() articleKey;
  articleCoverImageUrl;

  constructor(private uploadSvc: UploadService) { }

  ngOnInit() {
    this.getArticleCoverImage(this.articleKey);
  }

  getArticleCoverImage(articleKey) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc
      .getImage(articleKey, basePath)
      .subscribe(articleData => {
        if (articleData.url) {
          this.articleCoverImageUrl = articleData.url;
        }
      });
  }
}
