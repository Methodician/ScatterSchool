import { AuthService } from 'app/shared/services/auth/auth.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  articleKey: string;
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
          this.articleKey = params['key'];

        this.checkIfFeatured();
        this.getArticleData();
      });
    }
    else {
      this.checkIfFeatured();
      this.getArticleBody(this.articleData);
      this.getAuthor(this.articleData.authorKey);
      this.getProfileImage(this.articleData.authorKey);
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
    this.articleSvc.isBookmarked(this.user.$key, this.articleKey).subscribe(bookmark => {
      this.isArticleBookmarked = bookmark;
    })
  }

  bookmarkToggle() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        if (this.isArticleBookmarked)
          this.articleSvc.unBookmarkArticle(this.user.$key, this.articleKey);
        else
          this.articleSvc.bookmarkArticle(this.user.$key, this.articleKey);
      }
    })
  }

  edit() {
    this.router.navigate([`editarticle/${this.articleKey}`]);
  }

  navigateToHistory() {
    this.router.navigate([`articlehistory/${this.articleKey}`]);
  }

  toggleFeatured() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        if (this.isArticleFeatured)
          this.articleSvc.unsetFeaturedArticle(this.articleKey);
        else
          this.articleSvc.setFeaturedArticle(this.articleKey);
      }
    })

  }

  checkIfFeatured() {
    this.articleSvc.isArticleFeatured(this.articleKey).subscribe(featured => {
      this.isArticleFeatured = featured;
    });
  }

  getArticleData() {
    this.articleSvc.getArticleByKey(this.articleKey).subscribe(articleData => {
      this.getArticleBody(articleData);
      this.getAuthor(articleData.authorKey);
      this.getProfileImage(articleData.authorKey);
      this.getArticleCoverImage(this.articleKey)
    });
  }

  getArticleCoverImage(articleKey) {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc.getImage(articleKey, basePath).subscribe(articleData => {
      if (articleData.url) {
        this.articleCoverImageUrl = articleData.url;
      }
    });
  }

  getArticleBody(articleData: any) {
    this.articleSvc.getArticleBodyByKey(articleData.bodyKey).subscribe(articleBody => {
      articleData.body = articleBody.$value;
      this.article = articleData;
    });
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