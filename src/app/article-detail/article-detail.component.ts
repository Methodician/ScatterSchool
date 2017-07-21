import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  articleKey: string;
  isArticleFeatured: boolean;
  @Input() articleData: any;
  @Input() editingPreview = false;
  author;
  article;
  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!this.editingPreview) {
      this.route.params.subscribe(params => {
        if (params['id'])
          this.articleKey = params['id'];
        this.checkIfFeatured();
        this.getArticleData();
      });
    }
    else {
      this.checkIfFeatured();
      this.getArticleBody(this.articleData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //  Must make sure form is initalized before checking...
    if (changes['articleData'] && changes['articleData'].currentValue) {
      //if (changes['initialValue']) {
      // We have two methods to set a form's value: setValue and patchValue.
      this.article = changes['articleData'].currentValue;
    }

  }

  navigateToAuthor() {
    this.articleSvc.navigateToAuthor(this.author.$key);
  }

  edit() {
    this.router.navigate([`editarticle/${this.articleKey}`]);
  }

  toggleFeatured() {
    if (this.isArticleFeatured)
      this.articleSvc.unsetFeaturedArticle(this.articleKey);
    else
      this.articleSvc.setFeaturedArticle(this.articleKey);
  }

  checkIfFeatured() {
    this.articleSvc.isArticleFeatured(this.articleKey).subscribe(featured => {
      this.isArticleFeatured = featured;
    });
  }

  getArticleData() {
    this.articleSvc.getArticleById(this.articleKey).subscribe(articleData => {
      this.getArticleBody(articleData);
      this.getAuthor(articleData.authorId);
    });
  }

  getArticleBody(articleData: any) {
    this.articleSvc.getArticleBodyById(articleData.bodyId).subscribe(articleBody => {
      articleData.body = articleBody.$value;
      this.article = articleData;
    });
  }

  getAuthor(authorId: string) {
    this.articleSvc.getAuthorById(authorId).subscribe(author => {
      this.author = author;
    });
  }

}
