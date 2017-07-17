import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.css'],
  providers: [ArticleService]
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: any;
  @Input() authorKey;
  author;
  // KYLE -> Rather than declaring a variable here, we're going to create a
  // function to call from the click event just as you did in feature-preview.
  //navigateToArticle;
  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.author = this.articleService.getAuthorById(this.authorKey);
    // KYLE -> This is interesting, I dunno maybe it would actually work,
    // but I'm confused by it, so creating a funciton.
    //this.navigateToArticle = this.articleService.navigateToArticleDetail();
  }

  // KYLE -> So, the only difference between this and the regular routing
  // funciton we had before is that this one is just calling the new one we
  // made in the service, which is effectively doing the exact same thing
  // you were doing in feature-preview before we went down this path except
  // instead of using an exisig articleData object, it's just getting the key
  // passed in from here.
  navigateToArticleDetail() {
    this.articleService.navigateToArticleDetail(this.articleData.$key);
  }
}
