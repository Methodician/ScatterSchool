import { AuthService } from 'app/shared/services/auth/auth.service';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { UserService } from 'app/shared/services/user/user.service';
import { ArticleDetailFirestore, ArticleBodyFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'app-article-history-detail',
  templateUrl: './article-history-detail.component.html',
  styleUrls: ['./article-history-detail.component.scss', './../article-detail/article-detail.component.scss']
})
export class ArticleHistoryDetailComponent implements OnInit, OnChanges {
  @Input() articleId: string;
  @Input() articleData: any;
  author;
  article;
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
    this.getArticleBody(this.articleData);
    this.getAuthor(this.articleData.authorId);
    this.getProfileImage(this.articleData.authorId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['articleData'] && changes['articleData'].currentValue) {
      this.article = changes['articleData'].currentValue;
      this.getArticleBody(this.article);
    }
  }

  getArticleBody(articleData: ArticleDetailFirestore) {
    //  Firestore way:
    this.articleSvc
      .archivedArticleBody(articleData.bodyId)
      .valueChanges()
      .subscribe((body: ArticleBodyFirestore) => {
        if (body) {
          articleData.body = body.body;
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

  navigateToDetail() {
    this.router.navigate([`articledetail/${this.articleId}`]);
  }
}
