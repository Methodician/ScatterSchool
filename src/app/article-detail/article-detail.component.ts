import { Component, OnInit } from '@angular/core';
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
  //articleKey = '-KmYx0adsf9thosQFk8o';
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
      this.articleService.getArticleById(this.articleKey).subscribe(articleData => {
        // KYLE => While I was at it, I figured I'd set up this nested subscription for too.
        // Note how I also moved setting this.articleDetail = articleData inside that
        // nested subscription, so it's not set until everything is ready.
        this.articleService.getArticleBodyById(articleData.bodyId).subscribe(articleBody => {
          articleData.body = articleBody.$value;
          this.articleDetail = articleData;
        });
        //this.articleDetail = articleData;
      });
    })
  }
}
