import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-related',
  templateUrl: './article-related.component.html',
  styleUrls: ['./article-related.component.scss']
})
export class ArticleRelatedComponent implements OnInit {
  @Input() parentAllArticles: any;
  currentArticle: number = 0;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  constructor() { }

  ngOnInit() {
  }

  nextArticle(){
    if(this.currentArticle != this.parentAllArticles.length - 1){
      this.currentArticle++;
    }
  }

  prevArticle(){
    if(this.currentArticle != 0){
      this.currentArticle--;
    }
  }
  positionWrapper():string{
    return `${-320 * this.currentArticle}px`;
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.prevArticle();
    }
    if (action === this.SWIPE_ACTION.LEFT) {
      this.nextArticle();
    }
  }

}
