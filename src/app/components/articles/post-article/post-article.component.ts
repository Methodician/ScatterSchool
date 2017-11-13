import { UploadService } from 'app/shared/services/upload/upload.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from 'app/shared/class/upload';

@Component({
  selector: 'app-post-article',
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.scss']
})
export class PostArticleComponent implements OnInit {
  authInfo = null;
  article: any;
  selectedFiles;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private authSvc: AuthService,
    private uploadSvc: UploadService
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  save(article) {
    const articleKey = this.articleSvc.createNewArticle(this.authInfo.$uid, article);
    if (this.selectedFiles) {
      this.sendImgToUploadSvc(articleKey);
    }
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  sendImgToUploadSvc(articleKey) {
    const file = this.selectedFiles.item(0);
    const basePath = 'uploads/articleCoverImages';
    const currentUpload = new Upload(file);
    this.uploadSvc.uploadImage(currentUpload, articleKey, basePath);
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }
}
