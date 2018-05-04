import { UploadService } from 'app/shared/services/upload/upload.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { Component, OnInit, Input } from '@angular/core';
import { Upload } from 'app/shared/class/upload';
import { UserService } from 'app/shared/services/user/user.service';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Component({
  selector: 'app-post-article',
  templateUrl: './post-article.component.html',
  styleUrls: ['./post-article.component.scss']
})
export class PostArticleComponent implements OnInit {
  authInfo = null;
  userInfo: UserInfoOpen = null;
  article: any;
  selectedFiles;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private authSvc: AuthService,
    private uploadSvc: UploadService,
    userSvc: UserService,
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
    userSvc.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  async save(article) {
    console.log(article);
    // const articleId = await this.articleSvc.createArticle(this.userInfo, this.authInfo.$uid, article);    
    // console.log(article, articleId);
    // // if (this.selectedFiles) {
    // //   this.sendImgToUploadSvc(articleId);
    // // }
    // // this.router.navigate([`articledetail/${articleId}`]);
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
