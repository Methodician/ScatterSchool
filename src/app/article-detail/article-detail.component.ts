import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  articleKey: string;
  isArticleFeatured: boolean;
  @Input() articleData: any;
  author;
  articleDetail;
  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['id'])
        this.articleKey = params['id'];
      this.articleSvc.isArticleFeatured(this.articleKey).subscribe(featured => {
        this.isArticleFeatured = featured;
      });
      this.articleSvc.getArticleById(this.articleKey).subscribe(articleData => {
        this.articleSvc.getArticleBodyById(articleData.bodyId).subscribe(articleBody => {
          articleData.body = articleBody.$value;
          this.articleDetail = articleData;
        });
        this.articleSvc.getAuthorById(articleData.author).subscribe(author => {
          this.author = author;
        });
        //this.articleDetail = articleData;
      });
    });
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

}
