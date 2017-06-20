import { AuthService } from './../services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {

  id: any;
  routeParams: any;
  authInfo = null;
  article: any;

  constructor(
    private articleSvc: ArticleService,
    //private userSvc: UserService,
    private router: Router,
    authSvc: AuthService,
    private route: ActivatedRoute
  ) {
    authSvc.authInfo$.subscribe(info => {
      this.authInfo = info;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      //this is where the article service will be called
    })
  }

  edit(article){
    console.log(article); 
  }
}
