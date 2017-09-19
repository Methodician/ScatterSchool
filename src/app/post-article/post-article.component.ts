import { UploadService } from './../services/upload/upload.service';
import { AuthService } from './../services/auth/auth.service';
import { Router } from '@angular/router';
import { ArticleService } from './../services/article/article.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '../services/upload/upload';

@Component({
  selector: 'app-post-article',
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.css']
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
    this.sendImgToUploadSvc(articleKey);
    this.router.navigate([`articledetail/${articleKey}`]);
  }

  sendImgToUploadSvc(articleKey) {
    const file = this.selectedFiles;
    const basePath = 'uploads/articleCoverImages';
    const currentUpload = new Upload(file.item(0));
    this.uploadSvc.uploadImage(currentUpload, articleKey, basePath);
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }
}
