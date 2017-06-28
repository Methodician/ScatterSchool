import { AuthService } from './../services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  articleEditing: any;
  id: any;
  routeParams: any;
  authInfo = null;


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
      this.articleSvc.getArticleById(this.id).subscribe(articleToEdit => {
        let articleBodyId = articleToEdit.bodyId;
        this.articleSvc.getArticleBodyById(articleBodyId).subscribe(articleBody => {
          articleToEdit.body = articleBody.$value;
          let tagsObject = articleToEdit.tags;
          let tagsString = "";
          for (let tag in tagsObject) {
            tagsString += tag + ", ";
          }
          articleToEdit.tags = tagsString;
          articleToEdit.articleId = articleToEdit.$key;
          this.articleEditing = articleToEdit;
        })
      });
    })
  }

  edit(article, value) {
    console.log(article);
    this.articleSvc.updateArticle(this.authInfo.$uid, article)
  }

}
