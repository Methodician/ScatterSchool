import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { ArticleDetailFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'app-article-preview-card',
  templateUrl: './article-preview-card.component.html',
  styleUrls: ['./article-preview-card.component.scss']
})
export class ArticlePreviewCardComponent implements OnInit {
  @Input() articleData: ArticleDetailFirestore;
  author;
  profileImageUrl;
  articleCoverImageUrl;
  user;
  isArticleBookmarked;
  hoverClass: string = '';
  hoverBg: string = '';

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private uploadSvc: UploadService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.articleSvc
      .getAuthor(this.articleData.authorId)
      .subscribe(author => {
        this.author = author;
        if (author.$key) {
          this.getProfileImage(author.$key);
        }
      });
    this.userSvc
      .userInfo$
      .subscribe(user => {
        if (user.exists()) {
          this.user = user;
          this.checkIfBookmarked();
        }
      });
    this.getArticleCoverImage(this.articleData.articleId);
  }


  navigateToArticleDetail() {
    this.articleSvc.navigateToArticleDetail(this.articleData.articleId);
  }

  navigateToProfile() {
    this.articleSvc.navigateToProfile(this.articleData.authorId);
  }

  getProfileImage(uid) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc
      .getImage(uid, basePath)
      .subscribe(profileData => {
        if (profileData && profileData.url) {
          this.profileImageUrl = profileData.url;
        } else {
          this.profileImageUrl = 'https://www.fillmurray.com/200/300';
        }
      });
  }

  getArticleCoverImage(articleKey) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc
      .getImage(articleKey, basePath)
      .subscribe(articleData => {
        if (articleData && articleData.url) {
          this.articleCoverImageUrl = articleData.url;
        } else {
          this.articleCoverImageUrl = 'https://www.fillmurray.com/200/300';
        }
      });
  }

  checkIfBookmarked() {
    this.articleSvc
    .isBookmarked(this.user.$key, this.articleData.articleId)
    .subscribe(bookmark => {
        this.isArticleBookmarked = bookmark;
      });
  }

  bookmarkToggle() {
    this.authSvc
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (this.isArticleBookmarked) {
            this.articleSvc.unBookmarkArticle(this.user.$key, this.articleData.articleId);
          } else {
            this.articleSvc.bookmarkArticle(this.user.$key, this.articleData.articleId);
          }
        }
      });
  }

  hoverArticleCard(){
    console.log(this.hoverClass, "this is the hover class");
    this.hoverClass = this.hoverClass === '' ? "hover-bg": '';
    this.hoverBg = this.hoverBg === '' ? "rgba(0,184,212, 0.15)": '';
  }

  exitCard(){
    this.hoverClass = '';
    this.hoverBg = '';
  }

  enterCard(){
    this.hoverClass= "hover-bg";
    this.hoverBg = "rgba(0,184,212, 0.15)";
  }

}
