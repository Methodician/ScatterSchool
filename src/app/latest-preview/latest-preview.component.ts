import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.css']
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: any;
  @Input() authorKey;
  author;
  profileImageUrl;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    this.articleService.getAuthorByKey(this.articleData.authorKey).subscribe(author => {
      this.author = author;
    });
    this.getProfileImage();
  }

  navigateToArticleDetail() {
    this.articleService.navigateToArticleDetail(this.articleData.$key);
  }

  navigateToProfile() {
    this.articleService.navigateToProfile(this.articleData.authorKey);
  }

  getProfileImage() {
    this.uploadSvc.getProfileImage(this.articleData.authorKey).subscribe(profileData => {
      if (profileData.url) {
       this.profileImageUrl = profileData.url;
      }
    })
  }
}
