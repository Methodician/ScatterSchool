import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';

@Component({
  selector: 'article-search-preview',
  templateUrl: './article-search-preview.component.html',
  styleUrls: ['./article-search-preview.component.scss']
})
export class ArticleSearchPreviewComponent implements OnInit {
  @Input() articleData: any;
  author;
  profileImageUrl;
  articleCoverImageUrl;
  user;
  isArticleBookmarked;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleSvc: ArticleService,
    private uploadSvc: UploadService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.articleSvc
      .getAuthor(this.articleData.authorId)
      .subscribe(author => {
      this.author = author;
    });
    this.userSvc.userInfo$.subscribe(user => {
      if (user.exists()) {
        this.user = user;
        this.checkIfBookmarked();
      }
    });
    this.getProfileImage(this.articleData.authorId);
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
        if (profileData.url) {
          this.profileImageUrl = profileData.url;
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
        }
      });
  }

  checkIfBookmarked() {
    this.articleSvc
      .isBookmarked(this.user.$key, this.articleData.articleId)
      .subscribe(bookmark => {
        this.isArticleBookmarked = bookmark;
      })
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
      })
  }
}
