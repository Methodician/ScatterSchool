import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { ArticleDetailFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.scss']
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: ArticleDetailFirestore;
  author;
  profileImageUrl;
  articleCoverImageUrl;
  user;
  isArticleBookmarked;

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

  getArticleCoverImage(articleId) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc
      .getImage(articleId, basePath)
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
}
