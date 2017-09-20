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
  currentSelectedTab: SelectedTab = SelectedTab.latest;

  constructor(private route: ActivatedRoute, private articleService: ArticleService,) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params['mystring'];
    })
  }

  latestSelected() {
    this.currentSelectedTab = SelectedTab.latest;
  }

  allSelected() {
    this.currentSelectedTab = SelectedTab.all;
  }

}

export enum SelectedTab {
  'latest' = 1,
  'all'
}