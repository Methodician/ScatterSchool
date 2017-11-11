import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ArticleService } from 'app/shared/services/article/article.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ArticleService]
})
export class HomeComponent implements OnInit {
  routeParams;
  featuredArticles;
  latestArticles;
  allArticles;
  currentSelectedTab: SelectedTab = SelectedTab.latest;
  currentSelectedFeaturePreview: SelectedPreview = SelectedPreview.featuredList;
  currentSelectedLatestPreview: SelectedPreview = SelectedPreview.latestTile;
  currentSelectedAllPreview: SelectedPreview = SelectedPreview.allTile;

  constructor(private route: ActivatedRoute, private articleService: ArticleService, ) { }

  ngOnInit() {
    // call for All Articles
    this.articleService.getAllFeatured().subscribe(articles => {
      this.featuredArticles = articles;
    });
    // call For Latest Articles
    this.articleService.getLatest().subscribe(latest => {
      this.latestArticles = latest;
    });
    // call for All Articles
    this.articleService.getAllArticles().subscribe(response => {
      this.allArticles = response;
    });
  }

  // Methods for toggling between Latest and All Previews 
  selectLatest() {
    this.currentSelectedTab = SelectedTab.latest;
  }
  selectAll() {
    this.currentSelectedTab = SelectedTab.all;
  }
  // Methods for toggling between Featured Article List and Grid Previews
  featuredListView() {
    this.currentSelectedFeaturePreview = SelectedPreview.featuredList;
  }
  featuredTileView() {
    this.currentSelectedFeaturePreview = SelectedPreview.featuredTile;
  }
  // Methods for toggling between Latest Article List and Grid Preview
  latestListView() {
    this.currentSelectedLatestPreview = SelectedPreview.latestList;
  }
  latestTileView() {
    this.currentSelectedLatestPreview = SelectedPreview.latestTile;
  }
  // Methods for Toggleing between All Article List and Grid Preview
  allListView() {
    this.currentSelectedAllPreview = SelectedPreview.allList;
  }
  allTileView() {
    this.currentSelectedAllPreview = SelectedPreview.allTile;
  }

}

export enum SelectedTab {
  'latest' = 1,
  'all'
}

export enum SelectedPreview {
  'featuredList' = 1,
  'featuredTile',
  'latestList',
  'latestTile',
  'allList',
  'allTile'
}