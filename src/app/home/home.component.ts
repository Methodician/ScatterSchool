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
  latestActiveState: boolean;
  allActiveState: boolean;

  constructor(private route: ActivatedRoute, private articleService: ArticleService,) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params['mystring'];
      this.latestActiveState = true;
      this.allActiveState = false;
    })
  }

  latestSelected() {
    this.currentSelectedTab = SelectedTab.latest;
    this.latestActiveState = true;
    this.allActiveState = false;
  }

  allSelected() {
    this.currentSelectedTab = SelectedTab.all;
    this.allActiveState = true;
    this.latestActiveState = false;
  }

}

export enum SelectedTab {
  'latest' = 1,
  'all'
}