import { AuthService } from 'app/shared/services/auth/auth.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
export class ArticleDetailComponent implements OnInit, OnDestroy {

  articleKey: string;
  viewId: string = '';
  isArticleBookmarked: boolean;
  // isArticleFeatured: boolean;

  @Input() articleData: any;
  @Input() editingPreview = false;
  author;
  article;
  articleCoverImageUrl: string;
  iFollow: any;
  followsMe: any;
  // userInfo = null;
  profileImageUrl;
  user: UserInfoOpen = null;
  viewIncremented = false;




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
        //this.checkIfFeatured();
        this.getArticleData();
      });
    }
    else {
      //this.checkIfFeatured();
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
        if (this.article.isFeatured)
          this.articleSvc.unsetFeaturedArticle(this.articleKey);
        else
          this.articleSvc.setFeaturedArticle(this.articleKey);
      }
    })

  }

  //  Firebase, not Firestore... dep, delete soon if not used.
  // checkIfFeatured() {
  //   this.articleSvc.isArticleFeatured(this.articleKey).subscribe(featured => {
  //     this.isArticleFeatured = featured;
  //   });
  // }

  getArticleData() {
    //  Firestore way:
    this.articleSvc.getArticleById(this.articleKey).valueChanges().subscribe(async (articleData: ArticleDetailFirestore) => {
      if (!this.viewIncremented && !this.editingPreview) {
        try {
          const id = await this.articleSvc.captureArticleView(this.articleKey, articleData.version, this.user);
          if (id) {
            this.viewId = id;
            this.viewIncremented = true;
          }
        }
        catch (err) {
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
      this.getArticleBody(articleData);
      this.getAuthor(articleData.authorId);
      this.getProfileImage(articleData.authorId);
      this.getArticleCoverImage(this.articleKey)
    })
    //  Firebase way:
    // this.articleSvc.getArticleByKey(this.articleKey).subscribe(articleData => {
    //   this.articleSvc.incrementArticleViewCount(this.articleKey, articleData.version);
    //   this.getArticleBody(articleData);
    //   this.getAuthor(articleData.authorKey);
    //   this.getProfileImage(articleData.authorKey);
    //   this.getArticleCoverImage(this.articleKey)
    // });
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
    //  Firestore way:
    this.articleSvc.getArticleBodyById(articleData.bodyId).valueChanges().subscribe((articleBody: ArticleBodyFirestore) => {
      if (articleBody) {
        articleData.body = articleBody.body;
        this.article = articleData;
      }
    });
    //  Firebase way:
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