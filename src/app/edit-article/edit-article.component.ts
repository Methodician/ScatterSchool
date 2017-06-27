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
  @Input()
  id: any;
  routeParams: any;
  authInfo = null;
  inputArticle: any;

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
      this.articleSvc.getArticleById(this.id).subscribe(articleToEdit => {
        let articleBodyId = articleToEdit.bodyId;
        this.articleSvc.getArticleBodyById(articleBodyId).subscribe(articleBody => {
          articleToEdit.body = articleBody.$value;
        //create var for tag object and another variable for tag string
        let tagsObject = articleToEdit.tags.value;
        let tagsString = articleToEdit.tagsString;
        for(tagsObject of articleToEdit) {
          //loop through articleToEdit.tags and for each tag the tag string += tag.value+,
          tagsString += tagsString;
        }
          //set articleToEdit.tags = tags string
          this.inputArticle = articleToEdit;
        })
      });
    })
  }

  edit(article, value){
    console.log(article);
    this.articleSvc.updateArticle(this.authInfo.$uid, article)
  }

}
