import { AuthService } from 'app/shared/services/auth/auth.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { ArticleDetailFirestore, ArticleBodyFirestore } from 'app/shared/class/article-info';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() articleData: any;
  @Input() editingPreview = false;
  articleKey: string;
  viewId = '';
  isArticleBookmarked: boolean;
  author;
  article;
  articleCoverImageUrl: string;
  iFollow: any;
  followsMe: any;
  profileImageUrl;
  user: UserInfoOpen = null;
  viewIncremented = false;

  // kb
  allArticles: any;
  currentArticle: number = 0;

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
        if (params['key']) {
          this.articleKey = params['key'];
        }
        // this.checkIfFeatured();
        this.getArticleData();
      });
    } else {
      // this.checkIfFeatured();
      this.getArticleBody(this.articleData);
      this.getAuthor(this.articleData.authorId);
      this.getProfileImage(this.articleData.authorId);
    }
    this.userSvc.userInfo$.subscribe((user: UserInfoOpen) => {
      if (user.exists()) {
        this.user = user;
        this.checkIfBookmarked();
      }
    })

    this.articleSvc
    .getFeaturedArticles()
    .valueChanges()
    .subscribe(response => {
      this.allArticles = response;
    });
  }

  ngOnDestroy() {
    if (this.viewId) {
      this.articleSvc.captureArticleUnView(this.articleKey, this.viewId);
    }
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
    this.articleSvc
      .isBookmarked(this.user.$key, this.articleKey)
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
            this.articleSvc.unBookmarkArticle(this.user.$key, this.articleKey);
          } else {
            this.articleSvc.bookmarkArticle(this.user.$key, this.articleKey);
          }
        }
      });
  }

  edit() {
    this.router.navigate([`editarticle/${this.articleKey}`]);
  }

  get hasHistory() {
    return this.articleData && this.articleData.version > 1
  }

  navigateToHistory() {
    this.router.navigate([`articlehistory/${this.articleKey}`]);
  }

  toggleFeatured() {
    this.authSvc
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (this.article.isFeatured) {
            this.articleSvc.unFeatureArticle(this.articleKey);
          } else {
            //kb: changed this
            this.articleSvc.featureArticle(this.articleKey, this.author.$key);
          }
        }
      });
    
  }

  getArticleData() {
    //  Firestore way:
    this.articleSvc
      .getArticle(this.articleKey)
      .valueChanges()
      .subscribe(async (articleData: ArticleDetailFirestore) => {
        if (!this.viewIncremented && !this.editingPreview) {
          try {
            const id = await this.articleSvc.captureArticleView(this.articleKey, articleData.version, this.user);
            if (id) {
              this.viewId = id;
              this.viewIncremented = true;
            }
          } catch (err) {
            console.error(err);
          }

          // this.articleSvc.captureArticleView(this.articleKey, articleData.version, this.user)
          //   .then(id => {
          //     if (id) {
          //       this.viewId = id;
          //       this.viewIncremented = true;
          //     }
          //   })
          //   .catch(err => {
          //     console.error(err);
          //   });

        }
        if (articleData) {
          this.articleData = articleData;
          this.getArticleBody(articleData);
          this.getAuthor(articleData.authorId);
          this.getProfileImage(articleData.authorId);
          this.getArticleCoverImage(this.articleKey)
        }
      })
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

  getArticleBody(articleData: any) {
    this.articleSvc
      .getArticleBody(articleData.bodyId)
      .valueChanges()
      .subscribe((articleBody: ArticleBodyFirestore) => {
        if (articleBody) {
          articleData.body = articleBody.body;
          this.article = articleData;
        }
      });
  }

  getAuthor(authorKey: string) {
    this.articleSvc
      .getAuthor(authorKey)
      .subscribe(author => {
        this.author = author;
      });
  }

  followClick() {
    this.authSvc
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.userSvc.followUser(this.article.authorKey);
        }
      });
  }

  tagSearch(tag: string) {
    this.router.navigate([`/articlesearch/${tag}`]);
  }

  getProfileImage(authorKey) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc
      .getImage(authorKey, basePath)
      .subscribe(profileData => {
        if (profileData.url) {
          this.profileImageUrl = profileData.url;
        }
      });
  }

  getArticlesByTag(tag: string){
    this.articleSvc.getAllArticlesByTag(tag);
  }

  nextArticle(){
    if(this.currentArticle != this.allArticles.length - 1){
      this.currentArticle++;
    }
  }
  prevArticle(){
    if(this.currentArticle != 0){
      this.currentArticle--;
    }
  }
  positionWrapper():string{
    return `${-320 * this.currentArticle}px`;
  }
}
