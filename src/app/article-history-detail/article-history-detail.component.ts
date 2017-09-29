import { AuthService } from 'app/services/auth/auth.service';
import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'app-article-history-detail',
  templateUrl: './article-history-detail.component.html',
  styleUrls: ['./article-history-detail.component.scss', './../article-detail/article-detail.component.scss']
})
export class ArticleHistoryDetailComponent implements OnInit {

  @Input() articleKey: string;
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
    this.getAuthor(this.articleData.authorKey);
    this.getProfileImage(this.articleData.authorKey);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['articleData'] && changes['articleData'].currentValue) {
      this.article = changes['articleData'].currentValue;
      this.getArticleBody(this.article);
    }
  }

  getArticleBody(articleData: any) {
    this.articleSvc.getArticleBodyFromArchiveByKey(articleData.bodyKey).subscribe(articleBody => {
      articleData.body = articleBody.$value;
      this.article = articleData;
    });
  }

  getAuthor(authorKey: string) {
    this.articleSvc.getAuthorByKey(authorKey).subscribe(author => {
      this.author = author;
    });
  }

  getProfileImage(authorKey) {
    const basePath = 'uploads/profileImages/';
    this.uploadSvc.getImage(authorKey, basePath).subscribe(profileData => {
      if (profileData.url) {
        this.profileImageUrl = profileData.url;
      }
    });
  }

  navigateToDetail() {
    this.router.navigate([`articledetail/${this.articleKey}`]);
  }

}