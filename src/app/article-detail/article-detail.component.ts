import { Component, OnInit} from '@angular/core';
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
          this.articleDetail = articleData;
        });
    })
  }
}
