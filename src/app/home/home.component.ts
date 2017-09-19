import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ArticleService]
})
export class HomeComponent implements OnInit {
  routeParams;

  featuredSelected: boolean; 
  latestSelected: boolean; 
  allArticlesSelected: boolean;

  constructor(private route: ActivatedRoute, private articleService: ArticleService) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params['mystring'];
    })
    this.featuredSelected = true;
    this.latestSelected = false;
    this.allArticlesSelected = false;
  }

  getArticlesToView(arg : string) {
    if ( arg === 'featured') {
      this.featuredSelected = true;
      this.latestSelected = false;
      this.allArticlesSelected = false;
    } else if ( arg === 'latest') {
      this.latestSelected = true;
      this.featuredSelected = false;
      this.allArticlesSelected = false;
    } else if ( arg === 'all') {
      this.allArticlesSelected = true;
      this.featuredSelected = false;
      this.latestSelected = false;
    } else {
      return alert('Opps! I think something broke! :(');
    }
  }

}
