import { AuthService } from './../services/auth/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css', '../post-article/post-article.component.css']
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
      this.articleSvc.getArticleByKey(this.id).subscribe(articleToEdit => {
        let articleBodyKey = articleToEdit.bodyKey;
        this.articleSvc.getArticleBodyByKey(articleBodyKey).subscribe(articleBody => {
          articleToEdit.body = articleBody.$value;
          /* let tagsObject = articleToEdit.tags;
          let tagsString = "";
          for (let tag in tagsObject) {
            tagsString += tag + ", ";
          } */
          //articleToEdit.tags = tagsString;
          articleToEdit.articleKey = articleToEdit.$key;
          this.articleEditing = articleToEdit;
        })
      });
    })
  }


  //edit(article, tags) {
  edit(article) {
    //article.tags = tags;
    this.articleSvc.updateArticle(this.authInfo.$uid, article)
    this.router.navigate([`articledetail/${article.articleKey}`]);

  }

}
