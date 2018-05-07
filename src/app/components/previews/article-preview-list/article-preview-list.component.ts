import { UploadService } from 'app/shared/services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';
import { ArticleDetailFirestore } from 'app/shared/class/article-info';

@Component({
  selector: 'app-article-preview-list',
  templateUrl: './article-preview-list.component.html',
  styleUrls: ['./article-preview-list.component.scss']
})
export class ArticlePreviewListComponent implements OnInit {
  @Input() articleData: ArticleDetailFirestore;
  author;
  articleCoverImageUrl;
  hoverClass: string = '';
  hoverBg: string = '';

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    this.articleService
    .getAuthor(this.articleData.authorId)
    .subscribe(author => {
        this.author = author;
      });
    this.getArticleCoverImage();
  }

  navigateToArticleDetail() {
    this.articleService.navigateToArticleDetail(this.articleData.articleId);
  }

  navigateToProfile() {
    this.articleService.navigateToProfile(this.articleData.authorId);
  }

  getArticleCoverImage() {
    const basePath = 'uploads/articleCoverImages';
    this.uploadSvc
      .getImage(this.articleData.articleId, basePath)
      .subscribe(imageData => {
        if (imageData.url) {
          this.articleCoverImageUrl = imageData.url;
        }
      });
  }

  hoverArticleCard(){
    // console.log(this.hoverClass, "this is the hover class");
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
