import { AuthService } from 'app/shared/services/auth/auth.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { FirestoreArticleService } from 'app/shared/services/article/firestore-article.service';

import { ArticleDetailFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  articleId: string;
  isArticleBookmarked: boolean;
  isArticleFeatured: boolean;
  @Input() articleData: any;
  @Input() editingPreview = false;
  author;
  article;
  articleCoverImageUrl: string;
  iFollow: any;
  followsMe: any;
  userInfo = null;
  profileImageUrl;
  user = null;

  constructor(
    private articleSvc: ArticleService,
    private fsArticleSvc: FirestoreArticleService,
    private userSvc: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadSvc: UploadService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    if (!this.editingPreview) {
      this.route.params.subscribe(params => {
        if (params['key'])
          this.articleId = params['key'];
        // this.checkIfFeatured();
        this.getArticleData();
      });
    }
    else {
      this.checkIfFeatured();
      this.getArticleBody(this.articleData);
      this.getAuthor(this.articleData.authorId);
      this.getProfileImage(this.articleData.authorId);
    }
    this.userSvc.userInfo$.subscribe(user => {
      if (user.exists()) {
        this.user = user;
        this.checkIfBookmarked();
      }
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['articleData'] && changes['articleData'].currentValue) {
      this.article = changes['articleData'].currentValue;
    }
  }

  navigateToProfile() {
    this.articleSvc.navigateToProfile(this.author.$key);
  }

  checkIfBookmarked() {
    this.articleSvc.isBookmarked(this.user.$key, this.articleId).subscribe(bookmark => {
      this.isArticleBookmarked = bookmark;
    })
  }

  bookmarkToggle() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        if (this.isArticleBookmarked)
          this.articleSvc.unBookmarkArticle(this.user.$key, this.articleId);
        else
          this.articleSvc.bookmarkArticle(this.user.$key, this.articleId);
      }
    })
  }

  edit() {
    this.router.navigate([`editarticle/${this.articleId}`]);
  }

  navigateToHistory() {
    this.router.navigate([`articlehistory/${this.articleId}`]);
  }

  toggleFeatured() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        if (this.isArticleFeatured)
          this.articleSvc.unsetFeaturedArticle(this.articleId);
        else
          this.articleSvc.setFeaturedArticle(this.articleId);
      }
    })

  }

  checkIfFeatured() {
    this.articleSvc.isArticleFeatured(this.articleId).subscribe(featured => {
      this.isArticleFeatured = featured;
    });
  }

  getArticleData() {
    this.fsArticleSvc.getArticleById(this.articleId).valueChanges().subscribe((articleData: ArticleDetailFirestore) => {
      this.getArticleBody(articleData);
      this.getAuthor(articleData.authorId);
      this.getProfileImage(articleData.authorId);
      this.getArticleCoverImage(this.articleId);
    })
    // this.articleSvc.getArticleByKey(this.articleId).subscribe(articleData => {
    //   this.getArticleBody(articleData);
    //   this.getAuthor(articleData.authorKey);
    //   this.getProfileImage(articleData.authorKey);
    //   this.getArticleCoverImage(this.articleId);
    // });
  }

  getArticleCoverImage(articleId) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc.getImage(articleId, basePath).subscribe(articleData => {
      if (articleData.url) {
        this.articleCoverImageUrl = articleData.url;
      }
    });
  }

  getArticleBody(articleData: any) {
    this.fsArticleSvc.getArticleBodyById(articleData.bodyId).valueChanges().subscribe((articleBody: any) => {
      articleData.body = articleBody.body;
      this.article = articleData;
    })
    // this.articleSvc.getArticleBodyByKey(articleData.bodyKey).subscribe(articleBody => {
    //   articleData.body = articleBody.$value;
    //   this.article = articleData;
    // });
  }

  getAuthor(authorKey: string) {
    this.articleSvc.getAuthorByKey(authorKey).subscribe(author => {
      this.author = author;
    });
  }

  followClick() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        let followKey = this.article.authorKey;
        this.userSvc.followUser(followKey);
      }
    })

  }

  tagSearch(tag: string) {
    this.router.navigate([`/articlesearch/${tag}`]);
  }

  getProfileImage(authorKey) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc.getImage(authorKey, basePath).subscribe(profileData => {
      if (profileData.url) {
        this.profileImageUrl = profileData.url;
      }
    });
  }
}