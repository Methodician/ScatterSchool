import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';
import { UserService } from './../services/user/user.service';

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
  iFollow: any;
  followsMe: any;
  userInfo = null;

  constructor(
    private articleSvc: ArticleService,
    private userSvc: UserService,
    private router: Router,
    private route: ActivatedRoute
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
    this.articleSvc.getArticleByKey(this.articleKey).subscribe(articleData => {
      this.getArticleBody(articleData);
      this.getAuthor(articleData.authorKey);
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
    let followKey = this.article.authorKey;
    this.userSvc.followUser(followKey);
  }

  tagSearch(tag: string) {
    this.router.navigate([`/articlesearch/${tag}`]);
  }

}
