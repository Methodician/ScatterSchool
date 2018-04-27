import { ArticleService } from 'app/shared/services/article/article.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-article-history',
  templateUrl: './article-history.component.html',
  styleUrls: ['./article-history.component.scss']
})
export class ArticleHistoryComponent implements OnInit {
  articleId: string;
  articleHistory = [];
  noHistory = false;
  articleCount;
  curentArticleIndex = 0;
  intervalTimer;

  constructor(
    private articleSvc: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['key']) {
        this.articleId = params['key'];
        //  Firestore way:
        this.articleSvc
          .articleHistory(this.articleId)
          .valueChanges()
          .subscribe(history => {
            if (history.length > 0) {
              this.articleHistory = history;
              this.articleCount = history.length;
              this.curentArticleIndex = history.length - 1;
            } else {
              this.noHistory = true;
            }
          });
      }
    })
  }

  get isLoading() {
    return this.articleHistory.length === 0 && !this.noHistory;
  }

  get hasHistory() {
    return this.articleHistory.length > 0;
  }

  selectFirst() {
    this.curentArticleIndex = 0;
  }

  selectPrevious(): boolean {
    if (this.curentArticleIndex > 0) {
      this.curentArticleIndex--;
      return true;
    }
    return false;
  }

  selectNext(): boolean {
    if (this.curentArticleIndex < (this.articleCount - 1)) {
      this.curentArticleIndex++;
      return true;
    }
    return false;
  }

  stopCycle() {
    clearInterval(this.intervalTimer);
  }

  startForwardCycle() {
    this.intervalTimer = setInterval(() => this.cycleForward(), 600);
  }

  cycleForward() {
    if (!this.selectNext()) {
      this.selectFirst();
    }
  }

  selectedArticle() {
    if (this.articleHistory) {
      return this.articleHistory[this.curentArticleIndex];
    }
  }



  navigateToArticle() {
    this.router.navigate([`articledetail/${this.articleId}`]);
  }
}
