import { ArticleSearchPipe } from 'app/shared/pipes/article-search.pipe';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from 'app/shared/services/article/article.service';

@Component({
  selector: 'app-article-search-results',
  templateUrl: './article-search-results.component.html',
  styleUrls: ['./article-search-results.component.scss']
})
export class ArticleSearchResultsComponent implements OnInit {

  allArticles: any;
  searchResults: any;
  queryString: string;


  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private searchPipe: ArticleSearchPipe
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.articleSvc.getAllArticles().subscribe(articles => {
      for (let article of articles) {
        this.articleSvc.getArticleBodyByKey(article.bodyKey).subscribe(body => {
          article.body = body.$value;
        });
      }
      this.allArticles = articles;
      this.route.params.subscribe(params => {
        if (params['query']) {
          this.queryString = params['query'];
          this.searchResults = this.searchPipe.transform(this.allArticles, params['query']);
        }
        else console.log('No query found');
      })
    })

  }
}
