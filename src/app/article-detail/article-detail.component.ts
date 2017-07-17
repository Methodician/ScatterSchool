import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  providers: [ArticleService]
})
export class ArticleDetailComponent implements OnInit {
  articleKey: string;
  isArticleFeatured: boolean;
  @Input() articleData: any;
  author;
  articleDetail;
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['id'])
        this.articleKey = params['id'];
      this.articleService.isArticleFeatured(this.articleKey).subscribe(featured => {
        this.isArticleFeatured = featured;
      });
      this.articleService.getArticleById(this.articleKey).subscribe(articleData => {
        this.articleService.getArticleBodyById(articleData.bodyId).subscribe(articleBody => {
          articleData.body = articleBody.$value;
          this.articleDetail = articleData;
        });
        this.articleService.getAuthorById(articleData.author).subscribe(author => {
          this.author = author;
        });
        //this.articleDetail = articleData;
      });
    });
  }

  navigateToAuthor() {
    this.articleService.navigateToAuthor(this.author.$key);
  }

  edit() {
    this.router.navigate([`editarticle/${this.articleKey}`]);
  }

  toggleFeatured() {
    if (this.isArticleFeatured)
      this.articleService.unsetFeaturedArticle(this.articleKey);
    else
      this.articleService.setFeaturedArticle(this.articleKey);
  }

}
