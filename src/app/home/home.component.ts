import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ArticleService]
})
export class HomeComponent implements OnInit {
  routeParams;
  allArticles;
  constructor(private route: ActivatedRoute, private articleService: ArticleService) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params['mystring'];
      this.allArticles = this.articleService.getAllArticles();
      console.log(this.allArticles);
    })
  }
  
  setFeatured(articleID: string)
  {
    this.articleService.setFeaturedArticle(articleID);
  }
}
