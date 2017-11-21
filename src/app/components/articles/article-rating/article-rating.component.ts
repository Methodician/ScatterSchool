import { Component, OnInit, Input } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';
import { ArticleService } from 'app/shared/services/article/article.service';

@Component({
  selector: 'article-rating',
  templateUrl: './article-rating.component.html',
  styleUrls: ['./article-rating.component.scss']
})
export class ArticleRatingComponent implements OnInit {
  @Input() userInfo: UserInfoOpen;
  @Input() articleKey: string;
  ratingState: number = null;

  constructor(private articleSvc: ArticleService) {}

  ngOnInit() {
    this.articleSvc.getRatingByUserKey(this.userInfo.$key, this.articleKey).subscribe(ratingInfo => {
      if(ratingInfo.$exists()) this.ratingState = ratingInfo.rating;
      else this.ratingState = null;
      
    });
  }

  submitRating(newRating: number) {
    this.ratingState = (newRating == this.ratingState) ? null : newRating;
    this.articleSvc.submitRating(this.ratingState, this.userInfo.$key, this.articleKey);
  }

  getStateColor(state: number) {
    return (state == this.ratingState) ? 'primary' : '';
  }

}
